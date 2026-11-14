import { describe, expect, it, vi } from 'vitest';
import { checkSpam, verifyTurnstile, MIN_FILL_MS } from '../api/_lib/spam';

const now = 1_800_000_000_000;

describe('checkSpam', () => {
  it('passes a normal human submission', () => {
    expect(checkSpam({ website: '', startedAt: String(now - 20_000) }, 'Hello there', now)).toEqual({ spam: false });
  });
  it('passes when JavaScript is off (no timestamp)', () => {
    expect(checkSpam({}, 'Hello there', now).spam).toBe(false);
  });
  it('flags a filled honeypot', () => {
    expect(checkSpam({ website: 'http://x.example' }, 'Hello', now)).toMatchObject({ spam: true, reason: 'honeypot' });
  });
  it('flags submissions faster than a human could type', () => {
    expect(checkSpam({ startedAt: String(now - (MIN_FILL_MS - 1)) }, 'Hello', now)).toMatchObject({
      reason: 'timing-too-fast',
    });
  });
  it('flags stale or forged timestamps', () => {
    expect(checkSpam({ startedAt: String(now - 2 * 86_400_000) }, 'Hi', now)).toMatchObject({ reason: 'timing-stale' });
    expect(checkSpam({ startedAt: 'abc' }, 'Hi', now)).toMatchObject({ reason: 'timing-invalid' });
  });
  it('flags link stuffing and BBCode/HTML links', () => {
    expect(checkSpam({}, 'http://a http://b http://c http://d', now).spam).toBe(true);
    expect(checkSpam({}, '[url=http://x]cheap[/url]', now).spam).toBe(true);
  });
});

describe('verifyTurnstile', () => {
  it('is skipped when no secret is configured', async () => {
    expect(await verifyTurnstile(undefined, undefined, undefined)).toBe(true);
  });
  it('fails closed without a token when a secret is configured', async () => {
    expect(await verifyTurnstile('', 'secret', '1.2.3.4')).toBe(false);
  });
  it('uses the Cloudflare verdict', async () => {
    const ok = vi.fn(async () => new Response(JSON.stringify({ success: true })));
    const bad = vi.fn(async () => new Response(JSON.stringify({ success: false })));
    expect(await verifyTurnstile('tok', 'secret', '1.2.3.4', ok as unknown as typeof fetch)).toBe(true);
    expect(await verifyTurnstile('tok', 'secret', '1.2.3.4', bad as unknown as typeof fetch)).toBe(false);
  });
  it('fails closed when Cloudflare is unreachable', async () => {
    const boom = vi.fn(async () => {
      throw new Error('network');
    });
    expect(await verifyTurnstile('tok', 'secret', undefined, boom as unknown as typeof fetch)).toBe(false);
  });
});
