// Research helper: captures above-the-fold screenshots and structural facts of reference sites.
import { chromium } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'node:fs';
const sites = process.argv.slice(2);
const out = 'docs/research/refs';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36' });
const results = {};
for (const s of sites) {
  const page = await ctx.newPage();
  const slug = s.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  try {
    await page.goto(s, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(4000);
    const data = await page.evaluate(() => {
      const t = (el) => (el?.innerText || '').replace(/\s+/g, ' ').trim();
      const meta = (n) => document.querySelector(`meta[name="${n}"],meta[property="${n}"]`)?.content || '';
      const navLinks = [...document.querySelectorAll('header a, nav a')].map(t).filter(Boolean).slice(0, 25);
      const h1 = [...document.querySelectorAll('h1')].map(t).slice(0, 3);
      const h2 = [...document.querySelectorAll('h2')].map(t).filter(Boolean).slice(0, 14);
      const buttons = [...document.querySelectorAll('a,button')].filter((e) => /apply|contact|talk|get in touch|start|book|join|partner|work with|submit|learn/i.test(e.innerText || '')).map(t).slice(0, 12);
      const fonts = [...new Set([...document.querySelectorAll('h1,h2,p,a')].slice(0, 60).map((e) => getComputedStyle(e).fontFamily.split(',')[0].replace(/"/g, '')))];
      const bg = getComputedStyle(document.body).backgroundColor;
      const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { const j = JSON.parse(s.textContent); return (Array.isArray(j) ? j : (j['@graph'] || [j])).map((x) => x['@type']).flat(); } catch { return ['invalid']; } }).flat();
      const footer = t(document.querySelector('footer')).slice(0, 600);
      const forms = document.querySelectorAll('form').length;
      return { title: document.title, description: meta('description'), ogImage: !!meta('og:image'), canonical: document.querySelector('link[rel=canonical]')?.href || '', lang: document.documentElement.lang, h1, h2, navLinks: [...new Set(navLinks)], ctas: [...new Set(buttons)], fonts, bg, jsonLd: ld, footer, forms, wordCount: (document.body.innerText || '').split(/\s+/).length };
    });
    await page.screenshot({ path: `${out}/${slug}.jpg`, type: 'jpeg', quality: 60 });
    results[slug] = { url: page.url(), ...data };
    console.log('OK', slug);
  } catch (e) { results[slug] = { error: String(e).slice(0, 200) }; console.log('ERR', slug, String(e).slice(0, 120)); }
  await page.close();
}
writeFileSync(`${out}/facts.json`, JSON.stringify(results, null, 2));
await browser.close();
