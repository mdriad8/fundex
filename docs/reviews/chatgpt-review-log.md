# ChatGPT review log

All reviews took place in the founder's ChatGPT project **"Fundex"**, chat **"Fundex Activities Overview"**, driven by Claude through Chrome on 14 Nov 2026. Each entry records what was sent, ChatGPT's verdict (paraphrased), and what changed as a result. Nothing here claims a review that did not happen. If a round is missing, it has not taken place yet.

## Round 1: research and strategy

**Sent:** `docs/research/website-benchmark.md`, `docs/audit/current-website.md`, `docs/strategy/positioning.md`, `docs/strategy/claims-register.md`, the live homepage screenshot (`docs/screenshots/before/home-1440.jpg`), and a request to critique the positioning, the services, the audit/claims and the trust-builders.

**Verdict:** 8/10. Strategic direction approved, final copy not yet.

| ChatGPT point | Action taken |
|---|---|
| Keep "Where Strategy Meets Execution", but the supporting line must make a concrete promise | Sub-headline changed to ChatGPT's proposed wording |
| Rename "Investment readiness" to "Business planning & pitch preparation", restricted to plans, presentations and operational information | Done (`src/data/site.ts`), with a note limiting scope |
| Rename and narrow "Partnerships & opportunities" to "Commercial partnerships & business development"; remove "well-prepared opportunities" | Done. The Home audience card was rewritten as "Organisations seeking partners" and all investor-facing wording removed |
| A "not financial advice" statement alone doesn't remove arranging/dealing risk | The scope statement is kept, and the services no longer describe anything that could be arranging |
| Re-rate C4 (privacy) to High, because APP 5 isn't mandatory for every exempt small business | Re-rated to H10; the audit is now 3 Critical / 10 High |
| An MX record doesn't verify the mailbox: block the email until tested | Email hidden behind `contact.emailVerified=false`; the form fallbacks point to LinkedIn |
| LinkedIn isn't independent proof of the founding year: check ASIC/ABR | Checked ABN Lookup: ABN 49 694 783 205 active from 06 Feb 2026, VIC 3000. Founding year verified; ABN/ACN now displayed |
| Add a claims entry for every service, including who delivers it | Claims register B6a–B6f added |
| Trust-builders: founder accountability (photo, bio, legal details), a transparent process with example deliverables, original expertise content | Legal details shipped; photo/bio and first Insights article added to the owner decisions; the Services page lists concrete outcomes per service |

## Round 2: visual design

**Sent:** full-page screenshots of the rebuilt site (Home at 1440 and 390 px, Services 1440, About 1440, Contact 390, Insights 1440), plus the design-system rationale (palette adjustments, font choice).

**Verdict:** 8/10, conditional pass. It reads as a credible boutique Melbourne advisory firm, but more like a polished consultancy template than a distinctive business. Keep the colour system, typography, navigation, service language, legal positioning and the four-step process.

| ChatGPT point | Action taken |
|---|---|
| P1: the gold skyline is nearly invisible; build a deliberate strategy-to-execution graphic into the hero | New `PathGraphic` component: scattered faint lines converge into one gold stepped path through Understand → Shape → Execute → Review (Home hero, ≥ 1024 px). Inner-page skyline made more visible |
| P2: the "NT" avatar looks unfinished; use a real photo or a stronger text-led layout | Monogram removed. Text-led founder block with a gold rule, name, role and one factual sentence. Photo and bio remain owner decisions 7–8 |
| P3: service strips are monotonous; tighten mobile spacing; simplify the footer | Services alternate column order and card treatment. Home service cards are 2×2 with an audience line. Fluid section padding is tighter on mobile. The footer drops the services column below 768 px. The Insights empty state is compacted |
| Home service cards feel compressed | Changed from 4-across to 2×2 with larger type |
| Don't add decorative animation, fake logos or invented metrics | Nothing added |

## Round 3: content and conversion

**Sent:** the full copy of every page, exported from the built HTML (titles, meta descriptions, all body text, footer), plus Home and Contact screenshots.

**Verdict:** 8.5/10, conditional pass. Approved for round 4 after corrections. "The biggest remaining conversion risk is no longer the writing; it is whether the contact form reliably delivers enquiries and someone responds."

| ChatGPT point | Action taken |
|---|---|
| Services and Insights meta descriptions still said "investment readiness" | Both rewritten. "investment readiness" added to the content test's banned list |
| "Works directly with every client" / "no hand-off" are absolute operational promises | Rewritten to ChatGPT's suggestion ("…led by Nahid Tanjum, who oversees the firm's strategy and client engagements"). The principle was softened to "The founder oversees client engagements" |
| Outcomes imply guarantees ("Initiatives delivered", "qualified commercial partners") | Replaced with ChatGPT's exact wording: "Agreed priorities progressed, with milestones and outcomes documented"; "A researched shortlist of potential commercial partners for consideration" |
| Make the hero more specific about the work | Sub-headline replaced with "We work with founders and growing businesses on strategy, business planning, growth initiatives and practical execution." |
| Scam statement wording | Replaced on Contact and Legal with "Fundex Global does not solicit investments. Never share passwords, and independently verify any payment request through our official contact channel." |
| Add "I'm not sure yet" to the enquiry dropdown | Added (`not-sure`) |
| Replace the mandatory privacy consent with an acknowledgement of the linked collection notice | Checkbox removed. A short note with a link to `/privacy#collection-notice` now sits next to the submit button (`aria-describedby`). Validation and tests updated |
| Honeypot must be invisible and unfocusable | Already off-screen, `aria-hidden`, `tabindex=-1`. Covered by an e2e test |
| Success must mean server-confirmed delivery, with a retry path on failure | Already enforced: success shows only on HTTP 200 + `ok:true`, and every failure message gives a retry or alternative path. Covered by unit and e2e tests |
| Pass the selected service into the contact form | Each service section on `/services` now links to `/contact?enquiry=<id>`, which preselects the dropdown. Tested |
| Test the two-business-day reply promise against real inbox monitoring | Owner decision 11 (unchanged) |
| Verify AFSL status before publishing the "no AFSL" statement | Owner decision 2 (unchanged, blocking) |

## Round 4: technical (security, reliability, SEO, tests)

**Sent:** `fundex-technical-review.md`, containing the architecture, test results, before/after Lighthouse tables and the full source of `vercel.json`, `astro.config.mjs`, the contact API, handler, rate limiter, spam checks, validation, delivery, client script and base layout. Known limits were disclosed up front: a per-instance memory limiter, local-only Lighthouse, no field CWV.

**Verdict:** 8.5/10. Conditional pass for merge; **production release blocked** until the deployment gates are proven. "The site is technically well structured; the remaining challenge is proving it behaves correctly when external services fail."

| ChatGPT point | Action taken |
|---|---|
| **P0:** "Nothing was delivered" after a provider error is misleading; a timeout can occur after Resend accepted the email | Delivery now distinguishes **rejected** (provider 4xx → 502, "not delivered") from **unconfirmed** (timeout, network error or 5xx → 504, "We couldn't confirm that your message was received. Please wait a few minutes before resending…"). Unit tests cover 4xx, 5xx and timeout |
| Duplicate risk on retry; add idempotency | A deterministic `Idempotency-Key` (SHA-256 of sender + type + message) is sent to Resend. Tested |
| Log delivery IDs; never log enquiry contents | Logs `contact.sent {providerId}` and `contact.delivery_<reason> {providerStatus}` only. A test asserts that no email address or message text reaches the logs |
| `request.text()` buffers the whole body before the 20 KB check | Unsupported content types are rejected before reading. The body is read as a stream and reading stops at 20 KB. A test confirms early abort with no Content-Length |
| In-memory limits are bypassable; Redis errors fail open | With `VERCEL_ENV=production` and no Upstash, the form returns 503 (override: `RATE_LIMIT_ALLOW_MEMORY=true`). A store outage now falls back to memory limits instead of failing open. Tested |
| Prefer the platform-provided client address over forwarded headers | `getClientIp` uses Astro's `clientAddress` and consults forwarded headers only when it is missing or loopback (local development). Tested |
| JSON-LD must escape HTML-significant characters | Already: `jsonLd()` escapes `<` as `\u003c` |
| Tests verify app behaviour, not external integration (Resend accepted/rejected/timeout, Upstash outage, Turnstile, deployed CSP/redirects/JSON-LD, inbox arrival) | Not fakeable from here: these need the owner's Vercel, Resend and Upstash accounts. Listed as **blocking launch gates** in `docs/launch/deployment-checklist.md` §C and in the PR |
