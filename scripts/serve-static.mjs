// Serves the production build (.vercel/output/static) the way Vercel does, for Lighthouse and
// screenshots: clean URLs, 404.html with status 404, long-cache hashed assets, the security
// headers from vercel.json, and brotli/gzip compression.
// Usage: node scripts/serve-static.mjs [port]
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { brotliCompressSync, gzipSync } from 'node:zlib';
import path from 'node:path';

const root = path.resolve('.vercel/output/static');
const port = Number(process.argv[2] ?? 4400);
const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
const securityHeaders = Object.fromEntries(vercel.headers[0].headers.map((h) => [h.key, h.value]));
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]).replace(/\/+$/, '') || '/';
  const candidates = [clean, `${clean}/index.html`, `${clean}.html`];
  for (const c of candidates) {
    const p = path.join(root, c);
    if (p.startsWith(root) && existsSync(p) && statSync(p).isFile()) return p;
  }
  return null;
}

createServer((req, res) => {
  if (req.url === '/approach') {
    res.writeHead(301, { Location: '/services#how-we-work' }).end();
    return;
  }
  let file = resolve(req.url ?? '/');
  let status = 200;
  if (!file) {
    file = path.join(root, '404.html');
    status = 404;
  }
  let body = readFileSync(file);
  const ext = path.extname(file);
  const headers = { ...securityHeaders, 'Content-Type': TYPES[ext] ?? 'application/octet-stream' };
  headers['Cache-Control'] = req.url?.startsWith('/_astro/') ? 'public, max-age=31536000, immutable' : 'public, max-age=0, must-revalidate';
  const accept = String(req.headers['accept-encoding'] ?? '');
  if (/\.(html|js|css|svg|xml|txt|webmanifest)$/.test(ext)) {
    if (accept.includes('br')) {
      body = brotliCompressSync(body);
      headers['Content-Encoding'] = 'br';
    } else if (accept.includes('gzip')) {
      body = gzipSync(body);
      headers['Content-Encoding'] = 'gzip';
    }
  }
  res.writeHead(status, headers).end(body);
}).listen(port, '127.0.0.1', () => console.log(`static build on http://127.0.0.1:${port}`));
