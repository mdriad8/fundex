import { validateContact, type FieldErrors } from './validate.js';
import { checkSpam, verifyTurnstile } from './spam.js';
import {
  checkRate,
  CONTACT_RULES,
  EMAIL_RULE,
  hashKey,
  memoryStore,
  sharedStoreRequired,
  storeFromEnv,
  type RateRule,
  type RateStore,
  type RateResult,
} from './rateLimit.js';
import { deliver, deliveryConfigFromEnv } from './deliver.js';
import { site } from './config.js';

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
  | { status: 504; code: 'delivery-unconfirmed' }
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
  'delivery-failed': `Your message could not be sent because of a problem on our side, so it was not delivered. Please try again later or ${fallbackContact}.`,
  'delivery-unconfirmed': `We couldn't confirm that your message was received. Please wait a few minutes before resending, or ${fallbackContact}.`,
  'not-configured': `The contact form is not accepting messages yet, so nothing was sent. Please ${fallbackContact}.`,
};

/**
 * Client IP for rate limiting. On Vercel, `x-vercel-forwarded-for` / `x-forwarded-for` are set by the
 * platform edge (client-supplied values are not trusted through), so they reflect the real client.
 */
export function getClientIp(request: Request, platformAddress?: string): string | undefined {
  // Prefer the address the platform adapter provides. Forwarded headers are only consulted when the
  // platform address is missing or loopback (local development / a local reverse proxy).
  const loopback = !platformAddress || /^(127\.|::1$|::ffff:127\.)/.test(platformAddress);
  if (!loopback) return platformAddress;
  const xff = request.headers.get('x-vercel-forwarded-for') ?? request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  return request.headers.get('x-real-ip') ?? platformAddress;
}

const ALLOWED_TYPES = ['application/x-www-form-urlencoded', 'multipart/form-data', 'application/json'];

/** Read the body as text, aborting as soon as it exceeds `limit` bytes (no full buffering of large bodies). */
async function readLimited(request: Request, limit: number): Promise<string | 'too-large'> {
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel().catch(() => {});
      return 'too-large';
    }
    chunks.push(value);
  }
  const all = new Uint8Array(size);
  let offset = 0;
  for (const c of chunks) {
    all.set(c, offset);
    offset += c.byteLength;
  }
  return new TextDecoder().decode(all);
}

/** Rate-limit with the configured store; if a shared store fails, fall back to memory rather than failing open. */
async function rateCheck(store: RateStore, id: string, rules: RateRule[], log: Deps['log']): Promise<RateResult> {
  try {
    return await checkRate(store, id, rules);
  } catch (e) {
    // Degraded protection (per-instance only). Alert on this event; see deployment checklist §F.
    log?.('contact.rate_store_error', { error: String(e).slice(0, 200) });
    return checkRate(memoryStore(), id, rules);
  }
}

async function readBody(request: Request): Promise<Record<string, unknown> | 'too-large' | 'unsupported' | 'bad'> {
  const type = (request.headers.get('content-type') ?? '').toLowerCase();
  if (!ALLOWED_TYPES.some((t) => type.includes(t))) return 'unsupported';
  const declared = Number(request.headers.get('content-length') ?? '0');
  if (declared > MAX_BODY_BYTES) return 'too-large';
  const text = await readLimited(request, MAX_BODY_BYTES);
  if (text === 'too-large') return 'too-large';
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

  if (!deps.store && sharedStoreRequired(deps.env)) {
    log('contact.rate_store_missing');
    return { status: 503, code: 'not-configured' };
  }

  const ip = getClientIp(request, deps.clientAddress) ?? 'unknown';
  const salt = deps.env.RATE_LIMIT_SALT ?? 'fundex';
  const store = deps.store ?? storeFromEnv(deps.env);

  const ipRate = await rateCheck(store, await hashKey(ip, salt), CONTACT_RULES, log);
  if (!ipRate.allowed) {
    log('contact.rate_limited', { rule: ipRate.rule });
    return { status: 429, code: 'rate-limited', retryAfterSec: ipRate.retryAfterSec };
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

  const emailRate = await rateCheck(store, await hashKey(result.data.email, salt), [EMAIL_RULE], log);
  if (!emailRate.allowed) return { status: 429, code: 'rate-limited', retryAfterSec: emailRate.retryAfterSec };

  const delivery = await deliver(result.data, deliveryConfigFromEnv(deps.env), deps.fetchImpl, new Date(now()));
  if (!delivery.ok) {
    // Log the outcome only: never the enquiry contents or credentials.
    log(`contact.delivery_${delivery.reason}`, delivery.status ? { providerStatus: delivery.status } : undefined);
    if (delivery.reason === 'not-configured') return { status: 503, code: 'not-configured' };
    if (delivery.reason === 'rejected') return { status: 502, code: 'delivery-failed' };
    return { status: 504, code: 'delivery-unconfirmed' };
  }
  log('contact.sent', { providerId: delivery.id });
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
