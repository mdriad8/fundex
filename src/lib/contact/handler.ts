import { validateContact, type FieldErrors } from './validate';
import { checkSpam, verifyTurnstile } from './spam';
import { checkRate, CONTACT_RULES, EMAIL_RULE, hashKey, storeFromEnv, type RateStore } from './rateLimit';
import { deliver, deliveryConfigFromEnv } from './deliver';
import { site } from '../../data/site';

export const MAX_BODY_BYTES = 20_000;

export type Deps = {
  env: Record<string, string | undefined>;
  clientAddress?: string;
  store?: RateStore;
  fetchImpl?: typeof fetch;
  now?: () => number;
  log?: (event: string, detail?: Record<string, unknown>) => void;
};

type Outcome =
  | { status: 200; code: 'sent' }
  | { status: 400; code: 'rejected' | 'bad-request' | 'verification-failed' }
  | { status: 413; code: 'too-large' }
  | { status: 415; code: 'unsupported' }
  | { status: 422; code: 'invalid'; errors: FieldErrors }
  | { status: 429; code: 'rate-limited'; retryAfterSec: number }
  | { status: 502; code: 'delivery-failed' }
  | { status: 503; code: 'not-configured' };

const fallbackContact = site.contact.emailVerified
  ? `email us directly at ${site.contact.email}`
  : `contact us on LinkedIn (${site.social.linkedin})`;

export const MESSAGES: Record<Outcome['code'], string> = {
  sent: `Thank you. Your message has been sent. ${site.contact.responseTime}`,
  rejected: `We could not accept this submission. If you are a person, please ${fallbackContact}.`,
  'bad-request': `Something went wrong reading your submission. Please try again or ${fallbackContact}.`,
  'verification-failed': `We could not verify the submission. Please try again or ${fallbackContact}.`,
  'too-large': `Your message is too long to send through the form. Please shorten it or ${fallbackContact}.`,
  unsupported: `Something went wrong reading your submission. Please try again or ${fallbackContact}.`,
  invalid: 'Please check the highlighted fields and try again.',
  'rate-limited': `Too many messages have been sent from this connection. Please wait a while, or ${fallbackContact}.`,
  'delivery-failed': `Your message could not be sent because of a problem on our side. Nothing was delivered. Please try again later or ${fallbackContact}.`,
  'not-configured': `The contact form is not accepting messages yet, so nothing was sent. Please ${fallbackContact}.`,
};

export function getClientIp(request: Request, fallback?: string): string | undefined {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  return request.headers.get('x-real-ip') ?? fallback;
}

async function readBody(request: Request): Promise<Record<string, unknown> | 'too-large' | 'unsupported' | 'bad'> {
  const declared = Number(request.headers.get('content-length') ?? '0');
  if (declared > MAX_BODY_BYTES) return 'too-large';
  const type = (request.headers.get('content-type') ?? '').toLowerCase();
  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) return 'too-large';
  try {
    if (type.includes('application/json')) {
      const parsed = JSON.parse(text);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : 'bad';
    }
    if (type.includes('application/x-www-form-urlencoded')) {
      return Object.fromEntries(new URLSearchParams(text));
    }
    if (type.includes('multipart/form-data')) {
      const fd = await new Request('http://local', { method: 'POST', headers: { 'content-type': type }, body: text }).formData();
      const out: Record<string, unknown> = {};
      fd.forEach((v, k) => {
        if (typeof v === 'string') out[k] = v;
      });
      return out;
    }
  } catch {
    return 'bad';
  }
  return 'unsupported';
}

export async function processContact(request: Request, deps: Deps): Promise<Outcome> {
  const log = deps.log ?? (() => {});
  const now = deps.now ?? Date.now;
  const body = await readBody(request);
  if (body === 'too-large') return { status: 413, code: 'too-large' };
  if (body === 'unsupported') return { status: 415, code: 'unsupported' };
  if (body === 'bad') return { status: 400, code: 'bad-request' };

  const ip = getClientIp(request, deps.clientAddress) ?? 'unknown';
  const salt = deps.env.RATE_LIMIT_SALT ?? 'fundex';
  const store = deps.store ?? storeFromEnv(deps.env);

  try {
    const ipRate = await checkRate(store, await hashKey(ip, salt), CONTACT_RULES);
    if (!ipRate.allowed) {
      log('contact.rate_limited', { rule: ipRate.rule });
      return { status: 429, code: 'rate-limited', retryAfterSec: ipRate.retryAfterSec };
    }
  } catch (e) {
    // Fail open on a store outage so genuine enquiries are not lost; spam checks still apply.
    log('contact.rate_store_error', { error: String(e) });
  }

  const message = typeof body.message === 'string' ? body.message : '';
  const spam = checkSpam(body, message, now());
  if (spam.spam) {
    log('contact.spam', { reason: spam.reason });
    return { status: 400, code: 'rejected' };
  }

  const human = await verifyTurnstile(body['cf-turnstile-response'], deps.env.TURNSTILE_SECRET_KEY, ip, deps.fetchImpl);
  if (!human) return { status: 400, code: 'verification-failed' };

  const result = validateContact(body);
  if (!result.ok) return { status: 422, code: 'invalid', errors: result.errors };

  try {
    const emailRate = await checkRate(store, await hashKey(result.data.email, salt), [EMAIL_RULE]);
    if (!emailRate.allowed) return { status: 429, code: 'rate-limited', retryAfterSec: emailRate.retryAfterSec };
  } catch (e) {
    log('contact.rate_store_error', { error: String(e) });
  }

  const delivery = await deliver(result.data, deliveryConfigFromEnv(deps.env), deps.fetchImpl, new Date(now()));
  if (!delivery.ok) {
    log(`contact.${delivery.reason}`);
    return delivery.reason === 'not-configured'
      ? { status: 503, code: 'not-configured' }
      : { status: 502, code: 'delivery-failed' };
  }
  log('contact.sent');
  return { status: 200, code: 'sent' };
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function htmlPage(outcome: Outcome): string {
  const errors =
    outcome.code === 'invalid'
      ? `<ul>${Object.values(outcome.errors)
          .map((e) => `<li>${escapeHtml(e!)}</li>`)
          .join('')}</ul>`
      : '';
  return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Message not sent | Fundex Global</title><style>body{font-family:system-ui,Arial,sans-serif;max-width:40rem;margin:3rem auto;padding:0 1rem;color:#142033;line-height:1.6}a{color:#0b1422;font-weight:600}h1{font-size:1.75rem}</style></head><body><main><h1>Your message was not sent</h1><p role="alert">${escapeHtml(MESSAGES[outcome.code])}</p>${errors}<p><a href="/contact">Go back to the contact form</a></p></main></body></html>`;
}

/** Turn an outcome into an HTTP response: JSON for fetch() callers, redirect/HTML for plain form posts. */
export function toResponse(outcome: Outcome, request: Request): Response {
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');
  const headers: Record<string, string> = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' };
  if (outcome.code === 'rate-limited') headers['Retry-After'] = String(outcome.retryAfterSec);

  if (wantsJson) {
    return new Response(
      JSON.stringify({
        ok: outcome.code === 'sent',
        code: outcome.code,
        message: MESSAGES[outcome.code],
        ...(outcome.code === 'invalid' ? { errors: outcome.errors } : {}),
      }),
      { status: outcome.status, headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' } },
    );
  }
  if (outcome.code === 'sent') {
    return new Response(null, { status: 303, headers: { ...headers, Location: '/contact/thank-you' } });
  }
  return new Response(htmlPage(outcome), {
    status: outcome.status,
    headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export async function handleContact(request: Request, deps: Deps): Promise<Response> {
  return toResponse(await processContact(request, deps), request);
}
