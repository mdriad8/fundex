import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Local development only: serve /api/contact through the same handler Vercel runs in production,
 * so the contact form can be tested with `npm run dev`.
 */
function devApi(): Plugin {
  return {
    name: 'fundex-dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/contact', async (req, res) => {
        const mod = await server.ssrLoadModule('/api/contact.ts');
        const chunks: Buffer[] = [];
        for await (const c of req) chunks.push(c as Buffer);
        const headers = new Headers();
        for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v);
        const request = new Request(`http://${req.headers.host}/api/contact`, {
          method: req.method,
          headers,
          body: req.method === 'GET' || req.method === 'HEAD' ? undefined : Buffer.concat(chunks),
        });
        const handler = req.method === 'POST' ? mod.POST : mod.GET;
        const response: Response = await handler(request);
        res.statusCode = response.status;
        response.headers.forEach((v, k) => res.setHeader(k, v));
        res.end(Buffer.from(await response.arrayBuffer()));
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), devApi()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
