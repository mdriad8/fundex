/**
 * Content guard: scans the BUILT site for removed claims and out-of-scope topics.
 * Run `npm run build` first. See docs/strategy/claims-register.md (sections A and C).
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { site } from '../../src/data/site';

const OUT = '.vercel/output/static';

function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) return htmlFiles(p);
    return /\.(html|txt|xml)$/.test(f) ? [p] : [];
  });
}

const visibleText = (html: string) =>
  html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script(?![^>]*ld\+json)[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/\s+/g, ' ');

// Out of scope by instruction (claims register section C).
const OUT_OF_SCOPE = [/baazar/i, /silent intent/i, /hackathon/i, /beyond the prompt/i];

// Removed, unverified or regulated claims (claims register section A).
const REMOVED_CLAIMS = [
  /assets under management/i,
  /\bAUM\b/,
  /\$\s?500\s?k/i,
  /\$\s?25\s?M\b/i,
  /\$\s?500\s?M/i,
  /series b/i,
  /successful exits?/i,
  /portfolio compan/i,
  /\b87%/,
  /24\/7/,
  /london|singapore/i,
  /follow-on capital/i,
  /term sheets?/i,
  /first cheque/i,
  /business brokerage/i,
  /\bM&A\b/,
  /decades of combined experience/i,
  /testimonial/i,
  /well-prepared opportunities/i,
  /investment readiness/i,
  /works directly with every client/i,
  /initiatives delivered/i,
  /investment range/i,
  /deal size/i,
];

describe('built site content', () => {
  const ready = existsSync(OUT);
  it('has been built', () => {
    expect(ready, 'Run `npm run build` before the content tests').toBe(true);
  });
  if (!ready) return;
  const files = htmlFiles(OUT);
  const pages = files.map((f) => ({ f, text: visibleText(readFileSync(f, 'utf8')) }));

  it('builds every required page', () => {
    for (const p of ['index.html', 'about/index.html', 'services/index.html', 'insights/index.html', 'contact/index.html', '404.html']) {
      expect(existsSync(path.join(OUT, p)), p).toBe(true);
    }
  });

  it.each(OUT_OF_SCOPE.map((r) => [r.source, r]))('never mentions out-of-scope topic %s', (_, re) => {
    for (const { f, text } of pages) expect(re.test(text), `${f} matched ${re}`).toBe(false);
  });

  it.each(REMOVED_CLAIMS.map((r) => [r.source, r]))('contains no removed claim %s', (_, re) => {
    for (const { f, text } of pages) expect(re.test(text), `${f} matched ${re}`).toBe(false);
  });

  it('does not publish unverified contact details', () => {
    for (const { f, text } of pages) {
      if (!site.contact.phone.show) expect(text.includes('426 655 519'), f).toBe(false);
      if (!site.office.showStreetAddress) expect(/queen street/i.test(text), f).toBe(false);
      if (!site.contact.emailVerified) expect(text.includes(site.contact.email), f).toBe(false);
    }
  });

  it('shows the scope statement on every content page footer', () => {
    for (const { f, text } of pages.filter((p) => p.f.endsWith('.html'))) {
      expect(text.includes('does not hold an Australian Financial Services Licence'), f).toBe(true);
    }
  });

  it('marks the empty Insights listing as noindex and publishes no articles', () => {
    const html = readFileSync(path.join(OUT, 'insights/index.html'), 'utf8');
    const articles = readdirSync('src/content/insights').filter((f) => /\.mdx?$/.test(f));
    if (articles.length === 0) {
      expect(html).toContain('name="robots" content="noindex, follow"');
      expect(readFileSync(path.join(OUT, 'sitemap-0.xml'), 'utf8')).not.toContain('/insights');
    }
  });
});
