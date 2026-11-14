/**
 * POST /api/contact (Vercel Function, Web-standard Request/Response).
 * Validates, filters spam, rate-limits and emails the enquiry via Resend.
 * Never reports success unless the email provider accepted the message.
 * Configuration: see .env.example.
 */
import { handleContact } from './_lib/handler.js';

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true; // non-browser clients; spam checks and rate limits still apply
  try {
    const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? new URL(request.url).host;
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request): Promise<Response> {
  if (!sameOrigin(request)) {
    return new Response(JSON.stringify({ ok: false, code: 'forbidden', message: 'Cross-site submissions are not allowed.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  }
  return handleContact(request, {
    env: process.env as Record<string, string | undefined>,
    clientAddress: request.headers.get('x-real-ip') ?? undefined,
    log: (event, detail) => console.info(JSON.stringify({ event, ...detail })),
  });
}

export function GET(): Response {
  return new Response(JSON.stringify({ ok: false, code: 'method-not-allowed' }), {
    status: 405,
    headers: { Allow: 'POST', 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
