/**
 * Fixed-window rate limiting.
 *
 * - Production: set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN so limits are shared
 *   across all serverless instances (Upstash REST API, no SDK needed).
 * - Fallback: an in-memory store per serverless instance. This still blocks rapid bursts from
 *   one client but is NOT a global limit; the deployment checklist flags it.
 */

export type RateRule = { name: string; limit: number; windowSec: number };

export const CONTACT_RULES: RateRule[] = [
  { name: 'ip-burst', limit: 5, windowSec: 10 * 60 }, // 5 per 10 minutes per IP
  { name: 'ip-day', limit: 20, windowSec: 24 * 60 * 60 }, // 20 per day per IP
];
export const EMAIL_RULE: RateRule = { name: 'email-hour', limit: 3, windowSec: 60 * 60 };

export interface RateStore {
  /** Increment the counter for `key` and return the new count; the window starts on first hit. */
  hit(key: string, windowSec: number): Promise<number>;
  readonly kind: 'memory' | 'upstash';
}

export class MemoryStore implements RateStore {
  readonly kind = 'memory' as const;
  private map = new Map<string, { count: number; resetAt: number }>();
  constructor(private now: () => number = Date.now) {}
  async hit(key: string, windowSec: number) {
    const t = this.now();
    const entry = this.map.get(key);
    if (!entry || entry.resetAt <= t) {
      this.map.set(key, { count: 1, resetAt: t + windowSec * 1000 });
      if (this.map.size > 10_000) this.sweep(t);
      return 1;
    }
    entry.count += 1;
    return entry.count;
  }
  private sweep(t: number) {
    for (const [k, v] of this.map) if (v.resetAt <= t) this.map.delete(k);
  }
}

export class UpstashStore implements RateStore {
  readonly kind = 'upstash' as const;
  constructor(
    private url: string,
    private token: string,
    private fetchImpl: typeof fetch = fetch,
  ) {}
  async hit(key: string, windowSec: number) {
    const res = await this.fetchImpl(`${this.url.replace(/\/$/, '')}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, String(windowSec), 'NX'],
      ]),
      signal: AbortSignal.timeout(3_000),
    });
    if (!res.ok) throw new Error(`Upstash error ${res.status}`);
    const json = (await res.json()) as Array<{ result?: number; error?: string }>;
    const count = json[0]?.result;
    if (typeof count !== 'number') throw new Error('Upstash: unexpected response');
    return count;
  }
}

let memory: MemoryStore | undefined;
export function storeFromEnv(env: Record<string, string | undefined>): RateStore {
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    return new UpstashStore(env.UPSTASH_REDIS_REST_URL, env.UPSTASH_REDIS_REST_TOKEN);
  }
  memory ??= new MemoryStore();
  return memory;
}

/** Hash identifiers so raw IPs and emails are never used as storage keys. */
export async function hashKey(value: string, salt = ''): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${value}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest).slice(0, 16), (b) => b.toString(16).padStart(2, '0')).join('');
}

export type RateResult = { allowed: true } | { allowed: false; retryAfterSec: number; rule: string };

export async function checkRate(store: RateStore, id: string, rules: RateRule[]): Promise<RateResult> {
  for (const rule of rules) {
    const count = await store.hit(`fx:contact:${rule.name}:${id}`, rule.windowSec);
    if (count > rule.limit) return { allowed: false, retryAfterSec: rule.windowSec, rule: rule.name };
  }
  return { allowed: true };
}
