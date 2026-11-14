// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { readdirSync, existsSync } from 'node:fs';

export const SITE_URL = 'https://www.fundexglobal.vc';

// Insights are excluded from the sitemap until at least one article exists,
// so search engines are never pointed at an empty listing page.
const insightsDir = new URL('./src/content/insights/', import.meta.url);
const hasInsights =
  existsSync(insightsDir) && readdirSync(insightsDir).some((f) => /\.(md|mdx)$/.test(f));

const EXCLUDED = ['/contact/thank-you/', '/404/'];

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  output: 'static',
  adapter: vercel(),
  build: { format: 'directory', inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
  prefetch: false,
  // Legacy route: "Approach" content now lives on the Services page.
  redirects: {
    '/approach': { status: 301, destination: '/services#how-we-work' },
  },
  vite: { build: { assetsInlineLimit: 0 } },
  integrations: [
    sitemap({
      filter: (page) => {
        const p = new URL(page).pathname.replace(/\/?$/, '/');
        if (EXCLUDED.includes(p)) return false;
        if (!hasInsights && p.startsWith('/insights')) return false;
        return true;
      },
    }),
  ],
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Manrope',
      cssVariable: '--font-display',
      fallbacks: ['Arial', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['./node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2'],
            weight: '200 800',
            style: 'normal',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Inter',
      cssVariable: '--font-text',
      fallbacks: ['Arial', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['./node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'],
            weight: '100 900',
            style: 'normal',
          },
        ],
      },
    },
  ],
});
