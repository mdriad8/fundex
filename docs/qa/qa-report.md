# QA report

**Branch:** `redesign/corporate-site-v2` · **Date:** 14 Nov 2026 · **Machine:** Windows 11, Node 26 locally (Vercel builds with Node 24), Chrome stable.

Every number below was **measured**. Nothing is estimated or copied from elsewhere. Raw evidence is in the repo:
- Lighthouse JSON: `docs/qa/lighthouse/{before,after}/*.json.gz` (gzipped; screenshots stripped)
- Screenshots: `docs/screenshots/{before,after}/`
- Test sources: `tests/`

## 1. Automated tests

| Suite | Command | Result |
|---|---|---|
| Type check | `npx astro check` | **0 errors, 0 warnings** (47 files) |
| Unit + content | `npm test` (Vitest, after `npm run build`) | **84 passed** |
| End-to-end + accessibility | `npx playwright test` | **92 passed** |

**Unit (Vitest)** covers:
- validation: lengths, email format, enquiry enum, control-character stripping;
- spam: honeypot, too-fast / stale / forged timestamps, link stuffing, Turnstile on/off/failure;
- rate limiting: windows, separation, reset, the Upstash request shape, salted hashing;
- the HTTP handler: 200 sent; **503 when email isn't configured**; **502 on provider rejection (4xx)**; **504 "unconfirmed" on timeout or 5xx** (never claims non-delivery); idempotency key; logs free of enquiry contents; streaming 20 KB limit; production requires a shared rate-limit store; store outage falls back to memory; platform client IP preferred; 422 field errors; 400 honeypot; 413 / 415 / 400 malformed; 429 per IP with `Retry-After`; 429 per email across IPs; JSON bodies; Turnstile enforcement; no-JS 303 → thank-you **only on success**; HTML-escaped error page; header-injection stripping.

**Content guard** (`tests/content/claims.test.ts`) scans every built HTML/TXT/XML file. It checks for:
- the out-of-scope topics (Baazar, Silent Intent, hackathon);
- the removed claims (AUM, $500k, Series B, exits, portfolio companies, 87%, 24/7, London/Singapore, term sheets, brokerage, M&A, testimonials, "investment readiness", and more);
- unverified contact details (phone, street address, unverified email).

It also checks that the scope statement is on every page and that Insights is `noindex` and absent from the sitemap while empty.

**End-to-end (Playwright, Chrome)** covers:
- axe-core with tags `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa` on 8 pages at each of the 7 widths;
- no horizontal overflow, exactly one `h1`, and WCAG 2.5.8 target size ≥ 24 px;
- mobile menu (`aria-expanded`, Escape closes and returns focus), navigation without JavaScript, the skip link, visible focus;
- every internal link returns 200; `/approach` returns 301; unknown URLs return a real 404;
- contact form: an accessible error summary, the real API returning 503 with "nothing was sent", success **only** on `200 + ok:true`, a 200 without `ok` treated as failure, network failure, 429, server-side validation bypass, cross-site POST rejected (403), GET returns 405, `?enquiry=` preselect, honeypot hidden;
- SEO: title and description lengths and uniqueness, `www` canonicals, OG/Twitter tags, `lang="en-AU"`, JSON-LD Organization (legal name, ABN), WebSite and BreadcrumbList, robots.txt, the sitemap, icons, `llms.txt`.

## 2. Accessibility (WCAG 2.2 AA)

| Width (px) | 320 | 375 | 390 | 430 | 768 | 1024 | 1440 |
|---|---|---|---|---|---|---|---|
| axe violations, 8 pages | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Horizontal overflow | none | none | none | none | none | none | none |
| Target size < 24 px | none | none | none | none | none | none | none |

**Issues found and fixed during testing:**
- **2.5.3 Label in Name:** the logo link's `aria-label` didn't contain the visible "Fund'ex".
- **2.5.8 Target size:** a 22 px checkbox (since removed) and 20 px-tall standalone links.
- **The `hidden` attribute was overridden by `display:grid`,** so the form stayed visible after success. Fixed with a global `[hidden]{display:none!important}` rule.

**Checked manually or by design (not fully automatable):**
- contrast tokens were calculated in `docs/design/design-system.md`;
- `prefers-reduced-motion` disables smooth scrolling, and there is no looping animation;
- forced-colours mode hides the decorative graphic and keeps button borders;
- every form field has a visible label, and hints are linked with `aria-describedby`;
- errors are announced through a focused `role="alert"` summary;
- the page language is `en-AU`.

**Not done:** testing with real assistive technology (NVDA, VoiceOver, TalkBack) and on physical phones. axe-core finds an estimated 30–50% of WCAG issues, so a manual screen-reader pass is recommended before launch (deployment checklist §C).

## 3. Lighthouse and Core Web Vitals

**Tool:** Lighthouse 13.6.0 CLI, default mobile preset (simulated throttling: 150 ms RTT, ~1.6 Mbps, 4× CPU slowdown) and the desktop preset.

**Before**: the live site `https://www.fundexglobal.vc`, measured 14 Nov 2026:

| Report | Perf | A11y | Best pr. | SEO | FCP | LCP | TBT | CLS | Speed Index |
|---|---|---|---|---|---|---|---|---|---|
| about-desktop | 100 | 95 | 100 | 100 | 0.2 s | 0.2 s | 0 ms | 0 | 0.4 s |
| about-mobile | 98 | 95 | 100 | 100 | 0.8 s | 0.8 s | 150 ms | 0 | 0.9 s |
| contact-desktop | 100 | 96 | 100 | 100 | 0.2 s | 0.2 s | 0 ms | 0 | 0.4 s |
| contact-mobile | 100 | 96 | 100 | 100 | 0.8 s | 0.8 s | 80 ms | 0 | 0.9 s |
| home-desktop | 100 | 95 | 100 | 100 | 0.2 s | 0.2 s | 10 ms | 0 | 0.4 s |
| home-mobile | 100 | 95 | 100 | 100 | 0.8 s | 0.8 s | 50 ms | 0 | 1.0 s |
| services-desktop | 100 | 95 | 100 | 100 | 0.2 s | 0.2 s | 0 ms | 0 | 0.3 s |
| services-mobile | 100 | 95 | 100 | 100 | 0.8 s | 0.8 s | 50 ms | 0 | 1.0 s |

**After**: the new production build (`.vercel/output/static`), served by `scripts/serve-static.mjs` with the same security headers and compression as `vercel.json`, measured 14 Nov 2026:

| Report | Perf | A11y | Best pr. | SEO | FCP | LCP | TBT | CLS | Speed Index |
|---|---|---|---|---|---|---|---|---|---|
| about-desktop | 100 | 100 | 100 | 100 | 0.2 s | 0.2 s | 0 ms | 0 | 0.2 s |
| about-mobile | 100 | 100 | 100 | 100 | 0.6 s | 0.6 s | 0 ms | 0 | 0.6 s |
| contact-desktop | 100 | 100 | 100 | 100 | 0.2 s | 0.2 s | 0 ms | 0 | 0.3 s |
| contact-mobile | 100 | 100 | 100 | 100 | 0.6 s | 0.6 s | 10 ms | 0 | 0.7 s |
| home-desktop | 100 | 100 | 100 | 100 | 0.2 s | 0.2 s | 0 ms | 0 | 0.2 s |
| home-mobile | 100 | 100 | 100 | 100 | 0.6 s | 0.6 s | 0 ms | 0 | 0.6 s |
| insights-desktop | 100 | 100 | 100 | 66 | 0.2 s | 0.2 s | 0 ms | 0 | 0.2 s |
| insights-mobile | 100 | 100 | 100 | 66 | 0.6 s | 0.6 s | 0 ms | 0 | 0.6 s |
| services-desktop | 100 | 100 | 100 | 100 | 0.2 s | 0.2 s | 0 ms | 0 | 0.2 s |
| services-mobile | 100 | 100 | 100 | 100 | 0.6 s | 0.6 s | 0 ms | 0 | 0.6 s |

**How to read these honestly:**
- The old site was already fast in the lab (98–100). The gains are in **Accessibility (95–96 → 100)** and in what Lighthouse can't score: real HTML for crawlers and link previews, honest content, and a form that works.
- **Insights SEO 66 is deliberate.** The page is `noindex` while it has no articles (`is-crawlable` audit). It becomes 100 automatically when the first article is published.
- "Before" ran against Vercel's production CDN; "after" ran against a local server. Simulated throttling models the network the same way for both, but server response time differs. **Re-measure on the Vercel preview or production URL** (deployment checklist §C). The preview for this branch built successfully on Vercel, but it is protected by Vercel Authentication on the repository owner's team, so it could not be measured here.
- **Core Web Vitals:** the lab LCP and CLS values above are lab data, not field data. Field CWV (CrUX) **does not exist** for this origin because traffic is too low, so no field numbers are claimed anywhere. INP can't be measured in the lab. TBT (0–10 ms) is the lab proxy.

## 4. Visual QA

Before/after full-page screenshots (`docs/screenshots/`):
- **Before:** the live site at 390 and 1440 px (Home, Services, Approach, About, Contact).
- **After:** Home, Services, About, Insights and Contact at 390 and 1440 px, plus Home at all seven widths (`after/home-widths/`).

Each set was reviewed by eye and in ChatGPT review round 2.

## 5. Known limitations

1. Without the Upstash variables, rate limits are **per serverless instance**. They still stop rapid bursts but are not global.
2. Spam timing checks rely on JavaScript. Without JavaScript the form still works, protected by the honeypot, rate limits and optional Turnstile.
3. The privacy and legal pages are good-faith drafts, not legal advice (owner decision 6).
4. Until the email variables are set, the form deliberately refuses with HTTP 503 and says so.
