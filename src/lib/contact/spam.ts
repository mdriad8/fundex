/**
 * Layered, privacy-friendly spam checks. None of these alone is decisive; together with
 * rate limiting (and optional Cloudflare Turnstile) they stop the bulk of automated spam.
 */

export const HONEYPOT_FIELD = 'website';
export const MIN_FILL_MS = 3_000; // humans take longer than 3 s to complete the form
export const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;

export type SpamVerdict = { spam: false } | { spam: true; reason: string };

export function checkSpam(raw: Record<string, unknown>, message: string, now = Date.now()): SpamVerdict {
  // 1. Honeypot: a visually hidden field real users never fill in.
  const hp = raw[HONEYPOT_FIELD];
  if (typeof hp === 'string' && hp.trim() !== '') return { spam: true, reason: 'honeypot' };

  // 2. Timing: the form records when it was rendered (only set when JavaScript runs).
  //    A missing value is allowed so the form still works without JavaScript.
  const startedRaw = raw.startedAt;
  if (typeof startedRaw === 'string' && startedRaw !== '') {
    const started = Number(startedRaw);
    if (!Number.isFinite(started)) return { spam: true, reason: 'timing-invalid' };
    const elapsed = now - started;
    if (elapsed < MIN_FILL_MS) return { spam: true, reason: 'timing-too-fast' };
    if (elapsed > MAX_FORM_AGE_MS) return { spam: true, reason: 'timing-stale' };
  }

  // 3. Content heuristics: link-stuffing and markup are typical of spam.
  const links = (message.match(/https?:\/\/|www\./gi) ?? []).length;
  if (links > 3) return { spam: true, reason: 'too-many-links' };
  if (/<a\s+href=|\[url=|\[link=/i.test(message)) return { spam: true, reason: 'markup' };

  return { spam: false };
}

/** Optional Cloudflare Turnstile verification. Only enforced when TURNSTILE_SECRET_KEY is set. */
export async function verifyTurnstile(
  token: unknown,
  secret: string | undefined,
  ip: string | undefined,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  if (!secret) return true;
  if (typeof token !== 'string' || token.length === 0 || token.length > 2048) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  try {
    const res = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(5_000),
    });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}
