import type { ContactInput } from './validate';
import { enquiryTypes } from '../../data/site';

export type DeliveryConfig = {
  apiKey?: string;
  to?: string;
  from?: string;
};

/**
 * - `rejected`: the provider definitively refused the message (HTTP 4xx). Nothing was sent.
 * - `unconfirmed`: timeout, network error or provider 5xx. The provider MAY have accepted it,
 *   so we must not tell the visitor that nothing was delivered (ChatGPT review round 4).
 */
export type DeliveryResult =
  | { ok: true; id?: string }
  | { ok: false; reason: 'not-configured' | 'rejected' | 'unconfirmed'; status?: number };

export function deliveryConfigFromEnv(env: Record<string, string | undefined>): DeliveryConfig {
  return { apiKey: env.RESEND_API_KEY, to: env.CONTACT_TO_EMAIL, from: env.CONTACT_FROM_EMAIL };
}

export function isConfigured(c: DeliveryConfig): c is Required<DeliveryConfig> {
  return Boolean(c.apiKey && c.to && c.from);
}

/** Remove anything that could break out of an email header. */
const headerSafe = (s: string) => s.replace(/[\r\n]+/g, ' ').slice(0, 150);

export function buildEmail(input: ContactInput, meta: { receivedAt: Date }) {
  const label = enquiryTypes.find((t) => t.value === input.enquiryType)?.label ?? input.enquiryType;
  const subject = headerSafe(`Website enquiry: ${label} from ${input.name}`);
  const text = [
    `New enquiry via fundexglobal.vc`,
    ``,
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Organisation: ${input.organisation || '(not provided)'}`,
    `Enquiry type: ${label}`,
    `Privacy collection notice shown with form: yes`,
    `Received: ${meta.receivedAt.toISOString()}`,
    ``,
    `Message:`,
    input.message,
  ].join('\n');
  return { subject, text };
}

/**
 * Deterministic idempotency key: an identical resubmission (same sender, type and message) within the
 * provider's idempotency window is not sent twice, even if the first attempt timed out after acceptance.
 */
export async function idempotencyKey(input: ContactInput): Promise<string> {
  const data = new TextEncoder().encode(`${input.email}\n${input.enquiryType}\n${input.message}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return 'fx-contact-' + Array.from(new Uint8Array(digest).slice(0, 16), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Send via the Resend HTTP API (https://resend.com/docs/api-reference/emails/send-email). */
export async function deliver(
  input: ContactInput,
  config: DeliveryConfig,
  fetchImpl: typeof fetch = fetch,
  now = new Date(),
): Promise<DeliveryResult> {
  if (!isConfigured(config)) return { ok: false, reason: 'not-configured' };
  const { subject, text } = buildEmail(input, { receivedAt: now });
  try {
    const res = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': await idempotencyKey(input),
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        reply_to: input.email,
        subject,
        text,
      }),
      signal: AbortSignal.timeout(8_000),
    });
    if (res.status >= 400 && res.status < 500) return { ok: false, reason: 'rejected', status: res.status };
    if (!res.ok) return { ok: false, reason: 'unconfirmed', status: res.status };
    const json = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: json.id };
  } catch {
    // Timeout or network failure: the provider may or may not have accepted the message.
    return { ok: false, reason: 'unconfirmed' };
  }
}
