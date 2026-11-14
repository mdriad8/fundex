import { test, expect, type Page } from '@playwright/test';

// Each test gets its own client IP so the API's rate limiter (5 per 10 minutes per IP) does not
// carry over between test runs against the same dev server.
const testIp = () => `198.18.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

async function fillValid(page: Page) {
  await page.getByLabel('Your name').fill('Alex Citizen');
  // Unique address per run: the API also limits each email address to 3 messages per hour.
  await page.getByLabel('Email address').fill(`alex+${Date.now()}${Math.floor(Math.random() * 1e4)}@example.com`);
  await page.getByLabel('What is your enquiry about?').selectOption('strategy');
  await page.getByLabel('Your message').fill('We are planning the next stage of growth and want to talk it through.');
}

test.describe('contact form', () => {
  test('shows accessible field errors and an error summary for empty submission', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: 'Send message' }).click();
    const status = page.locator('[data-status]');
    await expect(status).toBeVisible();
    await expect(status).toBeFocused();
    await expect(status).toContainText('Please check the highlighted fields');
    await expect(page.getByLabel('Your name')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#email-error')).toHaveText('Please enter your email address.');
    // The summary links move focus to the field
    await status.getByRole('link', { name: /Your message/ }).click();
    await expect(page.getByLabel('Your message')).toBeFocused();
  });

  test('with no email provider configured, the real API refuses and the page says nothing was sent', async ({ page }) => {
    await page.setExtraHTTPHeaders({ 'x-forwarded-for': testIp() });
    await page.goto('/contact');
    await fillValid(page);
    await page.waitForTimeout(3_200); // the server rejects forms completed in under 3 seconds
    const [response] = await Promise.all([
      page.waitForResponse('**/api/contact'),
      page.getByRole('button', { name: 'Send message' }).click(),
    ]);
    expect(response.status()).toBe(503);
    const status = page.locator('[data-status]');
    await expect(status).toHaveAttribute('data-tone', 'error');
    await expect(status).toContainText('nothing was sent');
    await expect(status).not.toContainText('Thank you');
    await expect(page.locator('form[data-contact-form]')).toBeVisible();
  });

  test('shows success only when the server confirms delivery', async ({ page }) => {
    await page.route('**/api/contact', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, code: 'sent', message: 'Thank you. Your message has been sent.' }) }),
    );
    await page.goto('/contact');
    await fillValid(page);
    await page.getByRole('button', { name: 'Send message' }).click();
    const status = page.locator('[data-status]');
    await expect(status).toHaveAttribute('data-tone', 'success');
    await expect(status).toContainText('Your message has been sent');
    await expect(page.locator('form[data-contact-form]')).toBeHidden();
  });

  test('a 200 response without ok:true is NOT treated as success', async ({ page }) => {
    await page.route('**/api/contact', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: '<html>proxy page</html>' }));
    await page.goto('/contact');
    await fillValid(page);
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.locator('[data-status]')).toHaveAttribute('data-tone', 'error');
  });

  test('network failure and rate limiting are reported as errors', async ({ page }) => {
    await page.goto('/contact');
    await fillValid(page);

    await page.route('**/api/contact', (route) => route.abort('failed'));
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.locator('[data-status]')).toContainText('could not reach the server');

    await page.unroute('**/api/contact');
    await page.route('**/api/contact', (route) =>
      route.fulfill({ status: 429, contentType: 'application/json', headers: { 'Retry-After': '600' }, body: JSON.stringify({ ok: false, code: 'rate-limited', message: 'Too many messages have been sent from this connection.' }) }),
    );
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.locator('[data-status]')).toContainText('Too many messages');
    await expect(page.getByRole('button', { name: 'Send message' })).toBeEnabled();
  });

  test('server-side validation rejects bad data even if the browser checks are bypassed', async ({ request }) => {
    const res = await request.post('/api/contact', {
      headers: { Accept: 'application/json', Origin: 'http://127.0.0.1:4321', 'x-forwarded-for': testIp() },
      form: { name: 'A', email: 'bad', enquiryType: 'nope', message: 'hi', website: '' },
    });
    expect(res.status()).toBe(422);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(Object.keys(json.errors)).toEqual(expect.arrayContaining(['name', 'email', 'enquiryType', 'message']));
  });

  test('a service link preselects the enquiry type', async ({ page }) => {
    await page.goto('/contact?enquiry=partnerships');
    await expect(page.getByLabel('What is your enquiry about?')).toHaveValue('partnerships');
    await page.goto('/contact?enquiry=not-a-real-option');
    await expect(page.getByLabel('What is your enquiry about?')).toHaveValue('');
  });

  test('the privacy collection notice is linked next to the submit button', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('#privacy-note').getByRole('link', { name: 'privacy collection notice' })).toHaveAttribute('href', '/privacy#collection-notice');
  });

  test('the honeypot field is hidden from users and assistive technology', async ({ page }) => {
    await page.goto('/contact');
    const hp = page.locator('#website');
    await expect(hp).not.toBeInViewport();
    await expect(page.getByRole('textbox', { name: 'Leave this field empty' })).toHaveCount(0);
  });

  test('cross-site form posts are rejected (Astro checkOrigin, CSRF protection)', async ({ request }) => {
    const res = await request.post('/api/contact', {
      headers: { Origin: 'https://evil.example', 'x-forwarded-for': testIp() },
      form: { name: 'Alex', email: 'a@example.com', enquiryType: 'strategy', message: 'x'.repeat(30) },
    });
    expect(res.status()).toBe(403);
  });

  test('GET on the API is not allowed', async ({ request }) => {
    const res = await request.get('/api/contact');
    expect(res.status()).toBe(405);
  });
});
