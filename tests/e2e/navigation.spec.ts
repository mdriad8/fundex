import { test, expect } from '@playwright/test';

test.describe('mobile navigation', () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test('menu button toggles the nav, reports state and closes on Escape', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Menu' });
    const nav = page.getByRole('navigation', { name: 'Main' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(nav).toBeHidden();

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Services' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(nav).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test('navigation works without JavaScript', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 800 } });
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Contact' })).toBeVisible();
    await ctx.close();
  });
});

test('desktop nav marks the current page', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/services');
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Services' })).toHaveAttribute('aria-current', 'page');
});

test('skip link moves focus to the main content', async ({ page }) => {
  await page.goto('/about');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

test('every internal link resolves', async ({ page, request }) => {
  const seen = new Set<string>();
  for (const path of ['/', '/about', '/services', '/insights', '/contact', '/privacy', '/legal']) {
    await page.goto(path);
    const hrefs = await page.$$eval('a[href^="/"]', (as) => as.map((a) => (a as HTMLAnchorElement).getAttribute('href')!));
    for (const h of hrefs) seen.add(h.split('#')[0]!);
  }
  for (const href of seen) {
    const res = await request.get(href, { maxRedirects: 0 });
    expect(res.status(), href).toBe(200);
  }
});

test('legacy /approach permanently redirects to Services', async ({ request }) => {
  const res = await request.get('/approach', { maxRedirects: 0 });
  expect([301, 308]).toContain(res.status());
  expect(res.headers()['location']).toContain('/services');
});

test('unknown pages return a real 404', async ({ page }) => {
  const res = await page.goto('/this-page-does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('We could not find that page');
});

test('focus is visible on keyboard navigation', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab'); // skip link
  await page.keyboard.press('Tab'); // logo
  const shadow = await page.evaluate(() => getComputedStyle(document.activeElement!).boxShadow);
  expect(shadow).not.toBe('none');
});
