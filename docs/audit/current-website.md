# Audit: current website (www.fundexglobal.vc)

**Audited:** 14 Nov 2026 · **Code:** `mdriad8/fundex@main` b71c3a2 (Vercel production deploy of 22 May 2026, confirmed through the GitHub Deployments API) · **Live:** `https://fundexglobal.vc` → 308 → `https://www.fundexglobal.vc/`

**Evidence used:** full source read; live HTTP headers and responses (`curl`); Lighthouse 13.6.0 run against the live site (`docs/qa/lighthouse/before/*.json`); full-page screenshots at 390 and 1440 px (`docs/screenshots/before/`).

**Severity scale**
- **Critical:** legal or regulatory exposure, or a broken core function.
- **High:** materially harms trust, search visibility or accessibility compliance.
- **Medium:** a noticeable quality, UX or maintainability problem.
- **Low:** polish.

## Summary

| Severity | Count |
|---|---|
| Critical | 3 |
| High | 10 |
| Medium | 9 |
| Low | 6 |

Lab performance is **not** the problem. Lighthouse scores 98–100 for performance on every page, mobile and desktop. The risks are **what the site claims**, **a contact form that does nothing**, **client-only rendering** and **accessibility gaps**.

### Measured baseline (Lighthouse 13.6.0, 14 Nov 2026, live site, default mobile/desktop presets)

| Report | Perf | A11y | Best pr. | SEO | FCP | LCP | TBT | CLS | Speed Index |
|---|---|---|---|---|---|---|---|---|---|
| home-mobile | 100 | 95 | 100 | 100 | 0.8 s | 0.8 s | 50 ms | 0 | 1.0 s |
| home-desktop | 100 | 95 | 100 | 100 | 0.2 s | 0.2 s | 10 ms | 0 | 0.4 s |
| services-mobile | 100 | 95 | 100 | 100 | 0.8 s | 0.8 s | 50 ms | 0 | 1.0 s |
| services-desktop | 100 | 95 | 100 | 100 | 0.2 s | 0.2 s | 0 ms | 0 | 0.3 s |
| about-mobile | 98 | 95 | 100 | 100 | 0.8 s | 0.8 s | 150 ms | 0 | 0.9 s |
| about-desktop | 100 | 95 | 100 | 100 | 0.2 s | 0.2 s | 0 ms | 0 | 0.4 s |
| contact-mobile | 100 | 96 | 100 | 100 | 0.8 s | 0.8 s | 80 ms | 0 | 0.9 s |
| contact-desktop | 100 | 96 | 100 | 100 | 0.2 s | 0.2 s | 0 ms | 0 | 0.4 s |

Failing audits on home-mobile: `color-contrast`, `unsized-images`, `unused-javascript` (est. 38 KiB), `image-delivery-insight` (est. 349 KiB), `render-blocking-insight`. Lighthouse SEO scores 100 because Lighthouse executes JavaScript. Crawlers and link-preview bots that don't run JS see an empty page (see H2).

Field Core Web Vitals (CrUX) are **not available**. The origin has too little traffic to appear in the Chrome UX Report, so no field numbers are quoted anywhere in this work.

---

## Critical

**C1. Unverified and contradictory performance claims.** The site shows "$500k+ Assets Under Management", "5+ Portfolio Companies", "3+ Countries" and "5+ Successful Exits" (Home and About). It also shows "87% Founder-led board seats", "2+ yrs average hold period" and "5–10 active investments per year" (Approach). The About timeline says the firm was founded in **2024** and opened **London and Singapore offices in 2025**. Fundex's own LinkedIn page says founded **2026**, company size **2**, and the Contact page lists only Melbourne. Publishing figures that can't be substantiated risks breaching the misleading-or-deceptive-conduct provisions of the Australian Consumer Law (s18) and erodes trust with any diligent visitor. → Every item is listed in `docs/strategy/claims-register.md` (A1–A25) and removed in the redesign.

**C2. Advertises regulated financial services with no licence disclosure.** The site offers "Venture Capital — Seed to Series B investments… Investment Range $500K–$25M", "Follow-on capital reserves", "Clean term sheets… rapid deployment", and "Business Brokerage… Deal Size $5M–$500M+, M&A". Promoting investment, fund or deal-arrangement services in Australia generally requires an Australian Financial Services Licence (or authorised-representative status or an exemption). The site discloses none. → The redesign removes all investment and brokerage offers and adds a scope statement. The owner must confirm licensing (Owner decisions).

**C3. The contact form silently discards every enquiry.** `src/pages/Contact.tsx` `handleSubmit` calls `e.preventDefault()` then `console.log('Form submitted:', formData)`. Nothing is sent or stored, there is no confirmation and no error, so visitors believe they made contact when they didn't. → Replaced with a server-side endpoint that validates, rate-limits, filters spam, delivers by email and returns an honest success or failure.

## High

**H1. Canonical URLs point to the wrong host.** Every page's canonical and every sitemap URL uses `https://fundexglobal.vc/…`, but that host 308-redirects to `https://www.fundexglobal.vc/…`. Search engines get conflicting signals (canonical → redirect). `robots.txt` also points to the apex sitemap. → All URLs use `https://www.fundexglobal.vc`.

**H2. Client-only rendering: the HTML has no content or metadata.** The served HTML is an empty `<div id="root">`. Title, description and canonical are injected by `react-helmet-async` after JavaScript runs. Social previews (LinkedIn, WhatsApp, Slack) and AI crawlers that don't run JS see the title "Fund'ex " (with a trailing space), no description and no body text. → Static pre-rendered HTML for every page.

**H3. Soft 404s.** `vercel.json` rewrites `/(.*)` to `/index.html`. Any URL, such as `/this-page-does-not-exist`, returns **HTTP 200** with the app shell and no "not found" view. → A real 404 page with a 404 status.

**H4. Text contrast fails WCAG 2.2 AA (1.4.3).** Lighthouse `color-contrast` fails on all pages. Examples:
- Stats figures use a `teal-400 → teal-500` gradient on `gray-50` (≈2:1).
- The hero sub-labels "Quiet · Precise · Global" are `slate-500` on near-black.
- Teal-400 icons and text sit on white cards.

→ The new palette is contrast-checked (`docs/design/design-system.md`).

**H5. No Open Graph / social metadata or structured data.** No `og:*`, `twitter:*` or JSON-LD on any page, so link previews are bare and there are no Organization signals. → Full OG/Twitter metadata, a generated social image and Organization/WebSite/WebPage/BreadcrumbList JSON-LD.

**H6. Brand inconsistency.** The name appears as "Fund'ex" (logo, copy), "Fundex Global" (titles) and "Fund'ex" (LinkedIn). The header logo is a grey 3D-bevel "fund'ex" sans wordmark, while LinkedIn uses a white serif wordmark on black. → The redesign uses "Fundex Global" in copy and "Fund'ex" only as the wordmark, with a flat SVG redraw of the existing mark. The owner should confirm the master logo (Owner decisions).

**H7. Broken and placeholder links.** LinkedIn, Twitter and Email social icons, Privacy and Terms all link to `#`. The "Career Opportunities" button links to the general contact page with no careers process behind it. → Real links only.

**H8. Keyboard and screen-reader gaps.** There is no skip link. The mobile menu button has no `aria-expanded` or `aria-controls`, and the menu doesn't close on Escape. Gradient-clipped headings (`bg-clip-text text-transparent`) can disappear in Windows High Contrast / forced-colours mode. The contact form has no error messaging, so a failed submission gives no feedback at all. → Fixed in the new components.

**H9. Motion ignores user preferences.** `ScrollToTop` always uses `behavior: 'smooth'`, and the About timeline uses an infinite `animate-ping`. Neither respects `prefers-reduced-motion` (WCAG 2.3.3 / good practice under 2.2.2). → The new build has no infinite animation, and smooth scrolling is disabled under reduced motion.

**H10 (re-rated from Critical after ChatGPT review round 1). No privacy policy, yet the form collects personal information.** The footer "Privacy Policy" and "Terms of Service" links go to `#`. APP 5 collection notices are mandatory only for organisations covered by the *Privacy Act 1988*. A small business under the $3m turnover threshold may be exempt, so coverage needs confirming. A notice is still best practice and builds trust. → `/privacy` (collection notice + policy draft) and `/legal` (terms, scope and scam warning), both for owner/legal review.

## Medium

**M1. The favicon is a 118 KB PNG declared as `image/svg+xml`.** `index.html` declares `type="image/svg+xml"` for `logo1.png`. → SVG favicon plus a PNG apple-touch-icon.

**M2. Malformed `index.html`.** There is no closing `</head>`, and the `<title>` has a trailing space. → Rebuilt document shell.

**M3. Oversized imagery.** Lighthouse estimates 349 KiB of image-delivery savings. The logo PNGs are 877×269 and 290×243 RGBA and are served unoptimised. → SVG logo. No raster images above the fold.

**M4. No security headers beyond HSTS.** There is no `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` or frame protection. → Added in `vercel.json`.

**M5. Unused dependency.** `@supabase/supabase-js` is in `dependencies` but is never imported. → Removed.

**M6. Repetitive page templates.** All four inner pages share an identical hero (badge, two-line gradient H1, grid overlay), and copy is duplicated across Home, About and Approach (stats, "first cheque to final exit"). → A shared layout and components. Each page has one job.

**M7. Information architecture.** "Approach" overlaps heavily with "About" and "Services". Two "Schedule a Call" buttons are actually `tel:` links, which do nothing useful on desktop. → IA reduced to Home, Services (including how we work), About, Insights and Contact. `/approach` 301-redirects to `/services#how-we-work`.

**M8. Office hours conflict with how the business runs.** The site advertises "Mon–Fri 9–5 / Sat by appointment / multiple time zones globally". The founder works Monday to Thursday. → Removed. The response-time promise needs owner confirmation.

**M9. Generic stock language.** Phrases like "category-defining company", "We're not just investors", "Decades of combined experience" and "No hype. No vanity metrics." sit next to vanity metrics. → Rewritten in plain, specific language (see `docs/strategy/positioning.md`).

## Low

**L1.** The project is still named `vite-react-typescript-starter` at version `0.0.0`.
**L2.** `public/vite.svg` is a leftover starter asset.
**L3.** The `keywords` meta tag is used on every page. Search engines ignore it.
**L4.** The copyright year is computed client-side.
**L5.** The form placeholder "John Smith" is the only label hint, and the `select` has no visible chevron styling.
**L6.** The footer "Focus Areas" list is plain text that looks like links.

## Out of scope / not found

No Baazar, Silent Intent or hackathon content was found in the current code. The redesign keeps it that way and enforces it with a content test.
