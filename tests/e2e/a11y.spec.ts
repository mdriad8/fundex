import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export const PAGES = ['/', '/about', '/services', '/insights', '/contact', '/privacy', '/legal', '/contact/thank-you'];
export const WIDTHS = [320, 375, 390, 430, 768, 1024, 1440];
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

for (const width of WIDTHS) {
  test.describe(`@${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const path of PAGES) {
      test(`${path} passes axe WCAG 2.2 AA and has no horizontal overflow`, async ({ page }) => {
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);

        const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
        const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
        expect(summary, summary.join('\n')).toEqual([]);

        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, 'page is wider than the viewport').toBeLessThanOrEqual(0);

        await expect(page.locator('h1')).toHaveCount(1);
      });
    }

    test('interactive targets are at least 24×24 CSS px (WCAG 2.5.8)', async ({ page }) => {
      for (const path of ['/', '/contact', '/services']) {
        await page.goto(path);
        const small = await page.evaluate(() =>
          [...document.querySelectorAll<HTMLElement>('a, button, input, select, textarea, summary')]
            .filter((el) => {
              const s = getComputedStyle(el);
              if (s.display === 'none' || s.visibility === 'hidden' || el.closest('[aria-hidden="true"]')) return false;
              const r = el.getBoundingClientRect();
              if (r.width === 0 && r.height === 0) return false;
              // Inline links inside sentences are exempt under 2.5.8.
              const inline = s.display === 'inline' && el.tagName === 'A' && el.parentElement && /^(P|LI|DD|LABEL)$/.test(el.parentElement.tagName) && (el.parentElement.textContent ?? '').trim().length > (el.textContent ?? '').trim().length;
              return !inline && (r.width < 24 || r.height < 24);
            })
            .map((el) => `${el.tagName} "${(el.textContent ?? '').trim().slice(0, 30)}" ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`),
        );
        expect(small, `${path}: ${small.join('; ')}`).toEqual([]);
      }
    });
  });
}
