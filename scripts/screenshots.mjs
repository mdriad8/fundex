// Captures full-page screenshots of a site at fixed widths.
// Usage: node scripts/screenshots.mjs <baseUrl> <outDir> [widths] [paths]
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const base = (process.argv[2] || 'http://localhost:4321').replace(/\/$/, '');
const out = process.argv[3] || 'docs/screenshots/after';
const widths = (process.argv[4] || '390,1440').split(',').map(Number);
const paths = (process.argv[5] || 'home,about,services,insights,contact').split(',').map((s) => (s === 'home' ? '/' : '/' + s.replace(/^\/+/, '')));
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  for (const p of paths) {
    const res = await page.goto(base + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const name = (p === '/' ? 'home' : p.replace(/^\//, '').replace(/\//g, '-')) + `-${w}.jpg`;
    await page.screenshot({ path: `${out}/${name}`, fullPage: true, type: 'jpeg', quality: 70 });
    console.log(res?.status(), w, p, '->', name);
  }
  await ctx.close();
}
await browser.close();
