import { describe, expect, it, vi } from 'vitest';
import { MemoryStore, UpstashStore, checkRate, hashKey, CONTACT_RULES } from '../api/_lib/rateLimit';

describe('MemoryStore + checkRate', () => {
  it('allows up to the limit then blocks with a retry window', async () => {
    const store = new MemoryStore(() => 0);
    for (let i = 0; i < 5; i++) expect((await checkRate(store, 'ip1', CONTACT_RULES)).allowed).toBe(true);
    const blocked = await checkRate(store, 'ip1', CONTACT_RULES);
    expect(blocked).toMatchObject({ allowed: false, rule: 'ip-burst', retryAfterSec: 600 });
  });

  it('keeps clients separate', async () => {
    const store = new MemoryStore(() => 0);
    for (let i = 0; i < 6; i++) await checkRate(store, 'ip1', CONTACT_RULES);
    expect((await checkRate(store, 'ip2', CONTACT_RULES)).allowed).toBe(true);
  });

  it('resets after the window passes', async () => {
    let t = 0;
    const store = new MemoryStore(() => t);
    for (let i = 0; i < 6; i++) await checkRate(store, 'ip1', [CONTACT_RULES[0]!]);
    t = 601_000;
    expect((await checkRate(store, 'ip1', [CONTACT_RULES[0]!])).allowed).toBe(true);
  });
});

describe('UpstashStore', () => {
  it('sends INCR + EXPIRE NX and returns the count', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify([{ result: 3 }, { result: 0 }])));
    const store = new UpstashStore('https://example.upstash.io/', 'tok', fetchMock as unknown as typeof fetch);
    expect(await store.hit('k', 60)).toBe(3);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://example.upstash.io/pipeline');
    expect(JSON.parse(init.body as string)).toEqual([
      ['INCR', 'k'],
      ['EXPIRE', 'k', '60', 'NX'],
    ]);
  });
  it('throws on provider errors so the caller can decide', async () => {
    const fetchMock = vi.fn(async () => new Response('nope', { status: 500 }));
    const store = new UpstashStore('https://x', 'tok', fetchMock as unknown as typeof fetch);
    await expect(store.hit('k', 60)).rejects.toThrow();
  });
});

describe('hashKey', () => {
  it('is deterministic, salted and does not contain the input', async () => {
    const a = await hashKey('203.0.113.9', 's1');
    expect(a).toBe(await hashKey('203.0.113.9', 's1'));
    expect(a).not.toBe(await hashKey('203.0.113.9', 's2'));
    expect(a).not.toContain('203');
    expect(a).toMatch(/^[0-9a-f]{32}$/);
  });
});
