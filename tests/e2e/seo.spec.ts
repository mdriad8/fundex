import { test, expect } from '@playwright/test';

const INDEXABLE = ['/', '/about', '/services', '/contact', '/privacy', '/legal'];

for (const path of INDEXABLE) {
  test(`${path} has complete metadata and valid structured data`, async ({ page }) => {
    await page.goto(path);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThanOrEqual(65);
    expect(title).toContain('Fundex Global');

    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc!.length).toBeGreaterThanOrEqual(70);
    expect(desc!.length).toBeLessThanOrEqual(165);

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe(path === '/' ? 'https://www.fundexglobal.vc/' : `https://www.fundexglobal.vc${path}`);

    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://www.fundexglobal.vc/og/fundex-global.png');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-AU');

    const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
    const types = ld['@graph'].map((n: { '@type': string }) => n['@type']);
    expect(types).toEqual(expect.arrayContaining(['Organization', 'WebSite']));
    const org = ld['@graph'].find((n: { '@type': string }) => n['@type'] === 'Organization');
    expect(org.legalName).toBe('Fundex Global Pty Ltd');
    expect(org.taxID).toBe('49 694 783 205');
    if (path !== '/') expect(types).toContain('BreadcrumbList');
  });
}

test('titles and descriptions are unique across pages', async ({ page }) => {
  const titles = new Set<string>();
  const descs = new Set<string>();
  for (const path of INDEXABLE) {
    await page.goto(path);
    titles.add(await page.title());
    descs.add((await page.locator('meta[name="description"]').getAttribute('content'))!);
  }
  expect(titles.size).toBe(INDEXABLE.length);
  expect(descs.size).toBe(INDEXABLE.length);
});

test('noindex is applied to utility and empty pages', async ({ page }) => {
  for (const path of ['/contact/thank-you', '/insights']) {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  }
});

test('robots.txt points to the www sitemap and blocks the API', async ({ request }) => {
  const txt = await (await request.get('/robots.txt')).text();
  expect(txt).toContain('Sitemap: https://www.fundexglobal.vc/sitemap-index.xml');
  expect(txt).toContain('Disallow: /api/');
});

test('the social image and icons exist', async ({ request }) => {
  for (const p of ['/og/fundex-global.png', '/favicon.svg', '/favicon.ico', '/apple-touch-icon.png', '/site.webmanifest', '/llms.txt']) {
    expect((await request.get(p)).status(), p).toBe(200);
  }
});
