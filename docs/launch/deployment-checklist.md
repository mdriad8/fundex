# Deployment checklist and rollback plan

**Production** = the Vercel project connected to `mdriad8/fundex`, deploying `main` to `www.fundexglobal.vc`. The apex `fundexglobal.vc` 308-redirects to `www`.
**Rule:** nothing merges to `main` and nothing is promoted to production without the owner's explicit approval.

## A. Before merge: owner decisions (blocking)

See `docs/launch/owner-decisions.md` (tiers agreed in review round 5). Launch is blocked until all of these are settled:

- [ ] Services confirmed (claims register B6a–B6f), or edited in `src/data/site.ts`
- [ ] Positioning line approved ("Where strategy meets execution.")
- [ ] AFSL / authorisation status confirmed, so the scope statement is accurate (B8)
- [ ] Privacy and legal page wording approved
- [ ] Brand identity approved (logo redraw or master artwork)
- [ ] Monitored receiving inbox confirmed (then `contact.emailVerified: true` if it should be shown)
- [ ] Resend domain verification and Upstash configuration in place
- [ ] The two-business-day reply promise is operationally supported, or removed (`site.contact.responseTime`)
- [ ] The repository owner (GitHub **mdriad8**, Vercel team "md-riadul-hasan-bappis-projects") authorises the framework migration, preview access for testing, and the production release
- [ ] The owner approves the actual production deployment **after** §C passes

## B. Vercel configuration (owner or project admin)

1. **Framework preset:** Astro (auto-detected). Build command `npm run build`; output is handled by `@astrojs/vercel`. Node.js **24.x** (`package.json` engines).
2. **Environment variables** (Production and Preview), per `.env.example`:
   - [ ] `RESEND_API_KEY`: a Resend API key with send permission only
   - [ ] `CONTACT_TO_EMAIL`: the monitored inbox that receives enquiries
   - [ ] `CONTACT_FROM_EMAIL`: e.g. `Fundex Global website <web@fundexglobal.vc>`. **Verify `fundexglobal.vc` in Resend first**, adding the SPF/DKIM DNS records it lists to the domain's DNS without touching the existing Google Workspace MX records
   - [ ] `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`: **required in production**. With `VERCEL_ENV=production` and no shared store, the form returns 503 (review round 4). Set `RATE_LIMIT_ALLOW_MEMORY=true` only as a deliberate, temporary override
   - [ ] `RATE_LIMIT_SALT`: any long random string
   - [ ] Optional: `PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` (Cloudflare Turnstile), if spam gets through the honeypot and timing checks
3. Until the email variables are set, the form returns **HTTP 503** and tells visitors that nothing was sent. It never shows a false success.

## C. Pre-production verification (on the Vercel Preview URL for this branch)

- [ ] `npm ci && npm run build && npm test && npx playwright test` pass locally or in CI
- [ ] Preview: every page loads; `/approach` → 301 → `/services#how-we-work`; an unknown URL returns 404
- [ ] Preview: response headers include `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`
- [ ] Preview with email variables set: submit one real test enquiry. Confirm it arrives, that Reply-To is the visitor, and that the page shows success
- [ ] Preview with Resend temporarily misconfigured (wrong key): confirm the page shows the "could not be sent" error
- [ ] Six quick submissions from one connection: the sixth is refused with "Too many messages"
- [ ] Unconfirmed path: temporarily point `RESEND_API_KEY` at an invalid key and confirm the page shows the "could not be sent" (rejected) message. If possible, also simulate a provider timeout and confirm the "couldn't confirm" message
- [ ] Upstash outage: temporarily set a wrong `UPSTASH_REDIS_REST_TOKEN`, then confirm in the logs that limits still apply (`contact.rate_store_error`, memory fallback)
- [ ] Production without Upstash returns 503 (by design). Confirm Upstash is set before release
- [ ] If Turnstile is enabled: the widget renders under the CSP, and a submission without a token is refused
- [ ] Deployed CSP: no console CSP violations on any page; cross-origin POST to `/api/contact` returns 403
- [ ] Validate JSON-LD on the deployed URL with the Schema.org validator / Google Rich Results Test
- [ ] **Production-equivalent preview:** set the same Resend/Upstash/salt variables for the Preview environment (or a dedicated staging environment), then repeat the checks above against it. Provider API acceptance alone is not enough (review round 5)
- [ ] **One real enquiry received AND replied to:** send from a personal address, confirm it arrives in the monitored inbox, reply from that inbox, and confirm the reply arrives
- [ ] Lighthouse on the preview URL: mobile Performance ≥ 90, Accessibility 100, Best Practices ≥ 95, SEO 100. Record the results in `docs/qa/qa-report.md` (local results are not proof of production performance)
- [ ] Social preview: paste the preview URL into LinkedIn Post Inspector (owner's account) and check the title, description and image

## D. Release

1. Owner approves the PR in GitHub.
2. Merge into `main` (squash or merge commit, owner's preference). Vercel builds and deploys production automatically.
3. Within 10 minutes of deploy:
   - [ ] `https://www.fundexglobal.vc/`, `/services`, `/about`, `/insights`, `/contact` → 200
   - [ ] `https://fundexglobal.vc/` → 308 → `www`
   - [ ] `/sitemap-index.xml` and `/robots.txt` reachable; sitemap URLs use `https://www.fundexglobal.vc`
   - [ ] One live test enquiry is delivered
4. Google Search Console (owner's Google account): verify the `www` property if not already done, submit `/sitemap-index.xml`, and request indexing of `/`.
5. LinkedIn company page: set the website field to `https://www.fundexglobal.vc` (it currently says "My organization doesn't have a website").

## E. Rollback plan

> **Important (review round 5):** the pre-redesign site (production deployment of `b71c3a2`) still contains the unsupported investment claims and the contact form that silently discards messages (audit C1–C3). Restoring it is an **emergency availability measure only**, not a safe resting state. Prefer the compliant fallback page below, and roll forward with a fix.

| Situation | Action | Time |
|---|---|---|
| A single page or feature is broken | Roll **forward**: fix on a branch, preview, merge | varies |
| The new site is unusable | **Compliant fallback:** deploy `docs/launch/fallback/index.html`. It is a one-page notice with only verified facts, the scope statement and a LinkedIn link, `noindex`. Steps: on a branch, copy the file to `public/index.html`, temporarily remove `src/pages/index.astro`, push, test the preview, then promote it. Or upload it as a static Vercel project and point the domain at it | ~10 min |
| Total outage and no time to prepare the fallback | **Vercel dashboard → Deployments → the previous production deployment → "Promote to Production"** (Instant Rollback, no rebuild). Then replace it with the compliant fallback as soon as possible | < 1 min |
| Revert the code on `main` | If merged with a **merge commit**: `git revert -m 1 <merge-commit-sha>`. If **squash-merged**: `git revert <squash-commit-sha>` (no `-m`). If **rebase-merged**: revert each commit in reverse order. Push to `main`, and Vercel redeploys | ~3 min |
| Only the contact form misbehaves | Remove `RESEND_API_KEY` in Vercel and redeploy. The form returns 503 and tells visitors that nothing was sent, while the rest of the site stays up | ~2 min |
| Spam surge | Add the Turnstile keys and redeploy. Lower `CONTACT_RULES` limits in `src/lib/contact/rateLimit.ts` if needed | ~5 min |

The previous site remains available in Git history (`main` @ `b71c3a2`) and as the existing Vercel production deployment, so a rollback restores it byte-for-byte.

## F. After launch (first two weeks)

- Watch Vercel function logs for `contact.*` events: `contact.sent`, `contact.spam`, `contact.rate_limited`, `contact.delivery_rejected`, `contact.delivery_unconfirmed`, `contact.delivery_not-configured`, `contact.rate_store_error`, `contact.rate_store_missing`.
- **Alerts** (Vercel Log Drains or Monitoring → alert to the owner's email):
  - any `contact.rate_store_error`: Upstash is failing, so protection has degraded to per-instance memory limits. This is not equivalent protection; fix the same day;
  - two or more `contact.delivery_*` failures within 24 h: enquiries may be lost;
  - zero `contact.sent` for 14 days after launch: check the form still works.
- If spam protection becomes unreliable, disable submissions safely by removing `RESEND_API_KEY` (the form then says so honestly; see §E).
- Once there is enough traffic, check field Core Web Vitals in Search Console. None exist for this origin today.
