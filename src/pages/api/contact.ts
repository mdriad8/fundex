import type { APIRoute } from 'astro';
import { handleContact } from '../../lib/contact/handler';

// Rendered on demand as a Vercel Function; every other page is static.
export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let addr: string | undefined;
  try {
    addr = clientAddress;
  } catch {
    addr = undefined;
  }
  return handleContact(request, {
    env: process.env as Record<string, string | undefined>,
    clientAddress: addr,
    log: (event, detail) => console.info(JSON.stringify({ event, ...detail })),
  });
};

export const ALL: APIRoute = () =>
  new Response(JSON.stringify({ ok: false, code: 'method-not-allowed' }), {
    status: 405,
    headers: { Allow: 'POST', 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
