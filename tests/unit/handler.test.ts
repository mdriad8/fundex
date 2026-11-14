import { describe, expect, it, vi } from 'vitest';
import { handleContact, MAX_BODY_BYTES } from '../../src/lib/contact/handler';
import { MemoryStore } from '../../src/lib/contact/rateLimit';
import { buildEmail } from '../../src/lib/contact/deliver';

const NOW = 1_800_000_000_000;
const configured = {
  RESEND_API_KEY: 're_test',
  CONTACT_TO_EMAIL: 'to@example.com',
  CONTACT_FROM_EMAIL: 'web@example.com',
};

const fields = (over: Record<string, string> = {}) =>
  new URLSearchParams({
    name: 'Alex Citizen',
    email: 'alex@example.com',
    organisation: '',
    enquiryType: 'execution',
    message: 'We need help turning our plan into a delivery rhythm.',
    website: '',
    startedAt: String(NOW - 30_000),
    ...over,
  });

const req = (body: BodyInit, { json = true, type = 'application/x-www-form-urlencoded', ip = '203.0.113.1' } = {}) =>
  new Request('https://www.fundexglobal.vc/api/contact', {
    method: 'POST',
    headers: { 'content-type': type, accept: json ? 'application/json' : 'text/html', 'x-forwarded-for': ip },
    body,
  });

const okFetch = () => vi.fn(async () => new Response(JSON.stringify({ id: 'em_1' }), { status: 200 }));

const deps = (env: Record<string, string> = configured, fetchImpl?: unknown) => ({
  env,
  store: new MemoryStore(() => NOW),
  now: () => NOW,
  fetchImpl: (fetchImpl ?? okFetch()) as typeof fetch,
});

describe('handleContact', () => {
  it('delivers a valid message and reports success only after the provider accepts it', async () => {
    const fetchImpl = okFetch();
    const res = await handleContact(req(fields()), deps(configured, fetchImpl));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, code: 'sent' });
    expect(fetchImpl).toHaveBeenCalledOnce();
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.resend.com/emails');
    expect(JSON.parse(init.body as string)).toMatchObject({
      to: ['to@example.com'],
      from: 'web@example.com',
      reply_to: 'alex@example.com',
    });
  });

  it('never fakes success when email delivery is not configured (503)', async () => {
    const res = await handleContact(req(fields()), deps({}));
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.message).toMatch(/nothing was sent/i);
  });

  it('reports a definite provider rejection (4xx) as not delivered (502)', async () => {
    const failing = vi.fn(async () => new Response('err', { status: 422 }));
    const res = await handleContact(req(fields()), deps(configured, failing));
    expect(res.status).toBe(502);
    expect(await res.json()).toMatchObject({ ok: false, code: 'delivery-failed' });
  });

  it('never claims "not delivered" when the outcome is unknown: provider 5xx (504 unconfirmed)', async () => {
    const failing = vi.fn(async () => new Response('err', { status: 503 }));
    const res = await handleContact(req(fields()), deps(configured, failing));
    expect(res.status).toBe(504);
    const json = await res.json();
    expect(json).toMatchObject({ ok: false, code: 'delivery-unconfirmed' });
    expect(json.message).toMatch(/couldn't confirm/i);
    expect(json.message).not.toMatch(/not delivered|nothing was/i);
  });

  it('treats a timeout or network error as unconfirmed (504)', async () => {
    const timeout = vi.fn(async () => {
      throw new DOMException('The operation timed out.', 'TimeoutError');
    });
    const res = await handleContact(req(fields()), deps(configured, timeout));
    expect(res.status).toBe(504);
    expect((await res.json()).code).toBe('delivery-unconfirmed');
  });

  it('sends a deterministic Idempotency-Key so resubmissions are not duplicated', async () => {
    const f1 = okFetch();
    const f2 = okFetch();
    await handleContact(req(fields(), { ip: '192.0.2.10' }), deps(configured, f1));
    await handleContact(req(fields(), { ip: '192.0.2.11' }), deps(configured, f2));
    const key = (f: ReturnType<typeof okFetch>) =>
      new Headers((f.mock.calls[0] as unknown as [string, RequestInit])[1].headers).get('idempotency-key');
    expect(key(f1)).toMatch(/^fx-contact-[0-9a-f]{32}$/);
    expect(key(f1)).toBe(key(f2));
    const f3 = okFetch();
    await handleContact(req(fields({ message: 'A completely different message about growth.' })), deps(configured, f3));
    expect(key(f3)).not.toBe(key(f1));
  });

  it('logs outcomes without enquiry contents', async () => {
    const log = vi.fn();
    await handleContact(req(fields()), { ...deps(), log });
    const logged = JSON.stringify(log.mock.calls);
    expect(logged).toContain('contact.sent');
    expect(logged).not.toContain('alex@example.com');
    expect(logged).not.toContain('delivery rhythm');
  });

  it('returns field errors for invalid input (422) and sends nothing', async () => {
    const fetchImpl = vi.fn();
    const res = await handleContact(req(fields({ email: 'nope', message: 'short' })), deps(configured, fetchImpl));
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(Object.keys(json.errors)).toEqual(expect.arrayContaining(['email', 'message']));
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('rejects honeypot spam without sending and without claiming success', async () => {
    const fetchImpl = vi.fn();
    const res = await handleContact(req(fields({ website: 'spam' })), deps(configured, fetchImpl));
    expect(res.status).toBe(400);
    expect((await res.json()).ok).toBe(false);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('rate-limits repeated submissions from one IP (429 + Retry-After)', async () => {
    const d = deps({});
    let last: Response | undefined;
    for (let i = 0; i < 6; i++) last = await handleContact(req(fields()), d);
    expect(last!.status).toBe(429);
    expect(last!.headers.get('retry-after')).toBe('600');
  });

  it('rate-limits repeated submissions with one email across IPs', async () => {
    const d = deps(configured);
    const statuses: number[] = [];
    for (let i = 0; i < 4; i++) statuses.push((await handleContact(req(fields(), { ip: `198.51.100.${i}` }), d)).status);
    expect(statuses).toEqual([200, 200, 200, 429]);
  });

  it('rejects oversized bodies (413)', async () => {
    const res = await handleContact(req(fields({ message: 'x'.repeat(MAX_BODY_BYTES) })), deps());
    expect(res.status).toBe(413);
  });

  it('enforces the size limit while streaming, even without a Content-Length header', async () => {
    let pulled = 0;
    const chunk = new TextEncoder().encode('message=' + 'x'.repeat(8_000));
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulled++;
        if (pulled > 100) controller.close();
        else controller.enqueue(chunk);
      },
    });
    const r = new Request('https://www.fundexglobal.vc/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' },
      body: stream,
      // @ts-expect-error Node's undici requires duplex for streamed request bodies
      duplex: 'half',
    });
    const res = await handleContact(r, deps());
    expect(res.status).toBe(413);
    expect(pulled).toBeLessThan(10); // stopped reading early instead of buffering 800 KB
  });

  it('requires a shared rate-limit store in production (503) unless explicitly overridden', async () => {
    const prod = { ...configured, VERCEL_ENV: 'production' };
    const noStore = { env: prod, now: () => NOW, fetchImpl: okFetch() as unknown as typeof fetch };
    expect((await handleContact(req(fields()), noStore)).status).toBe(503);
    const override = { ...noStore, env: { ...prod, RATE_LIMIT_ALLOW_MEMORY: 'true' } };
    expect((await handleContact(req(fields(), { ip: '192.0.2.50' }), override)).status).toBe(200);
  });

  it('falls back to memory limits (not open) when the shared store fails', async () => {
    const broken = { kind: 'upstash' as const, hit: vi.fn(async () => { throw new Error('down'); }) };
    const d = { ...deps({}), store: broken };
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) statuses.push((await handleContact(req(fields(), { ip: '192.0.2.99' }), d)).status);
    expect(statuses.at(-1)).toBe(429);
  });

  it('prefers the platform client address over forwarded headers', async () => {
    const { getClientIp } = await import('../../src/lib/contact/handler');
    const r = req(fields(), { ip: '6.6.6.6' });
    expect(getClientIp(r, '203.0.113.7')).toBe('203.0.113.7');
    expect(getClientIp(r, '127.0.0.1')).toBe('6.6.6.6');
    expect(getClientIp(r, undefined)).toBe('6.6.6.6');
  });

  it('rejects unsupported content types (415) and malformed JSON (400)', async () => {
    expect((await handleContact(req('hello', { type: 'text/plain' }), deps())).status).toBe(415);
    expect((await handleContact(req('{oops', { type: 'application/json' }), deps())).status).toBe(400);
  });

  it('accepts JSON bodies', async () => {
    const body = JSON.stringify(Object.fromEntries(fields()));
    const res = await handleContact(req(body, { type: 'application/json' }), deps());
    expect(res.status).toBe(200);
  });

  it('enforces Turnstile when a secret is configured', async () => {
    const res = await handleContact(req(fields()), deps({ ...configured, TURNSTILE_SECRET_KEY: 'sec' }));
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe('verification-failed');
  });

  it('without JavaScript: redirects to the thank-you page only on real success', async () => {
    const ok = await handleContact(req(fields(), { json: false }), deps());
    expect(ok.status).toBe(303);
    expect(ok.headers.get('location')).toBe('/contact/thank-you');

    const notConfigured = await handleContact(req(fields(), { json: false }), deps({}));
    expect(notConfigured.status).toBe(503);
    expect(notConfigured.headers.get('content-type')).toContain('text/html');
    expect(await notConfigured.text()).toContain('Your message was not sent');
  });

  it('escapes user input in the no-JS error page', async () => {
    const res = await handleContact(req(fields({ name: '<script>x</script>', message: 'x' }), { json: false }), deps());
    const html = await res.text();
    expect(html).not.toContain('<script>x</script>');
  });
});

describe('buildEmail', () => {
  it('strips header-injection characters from the subject', () => {
    const { subject } = buildEmail(
      {
        name: 'Eve\r\nBcc: victim@example.com',
        email: 'e@example.com',
        organisation: '',
        enquiryType: 'other',
        message: 'm'.repeat(30),
      },
      { receivedAt: new Date(NOW) },
    );
    expect(subject).not.toMatch(/[\r\n]/);
  });
});
