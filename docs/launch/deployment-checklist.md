# Deployment checklist and rollback plan

**Production** = the Vercel project connected to `mdriad8/fundex`, deploying `main` to `www.fundexglobal.vc`. The apex `fundexglobal.vc` 308-redirects to `www`.
**Rule:** nothing merges to `main` and nothing is promoted to production without the owner's explicit approval.

## A. Before merge: owner decisions (blocking)

See `docs/launch/owner-decisions.md`. Launch is blocked until at least these are settled:

- [ ] Services confirmed (claims register B6a–B6f), or edited in `src/data/site.ts`
- [ ] Positioning line approved ("Where strategy meets execution.")
- [ ] AFSL / licensing status confirmed, so the scope statement is accurate (B8)
- [ ] `info@fundexglobal.vc` tested (send and receive), then `contact.emailVerified: true`
- [ ] Privacy and legal page wording reviewed
- [ ] Logo redraw approved, or master artwork supplied

## B. Vercel configuration (owner or project admin)

1. **Framework preset:** Astro (auto-detected). Build command `npm run build`; output is handled by `@astrojs/vercel`. Node.js **24.x** (`package.json` engines).
2. **Environment variables** (Production and Preview), per `.env.example`:
   - [ ] `RESEND_API_KEY`: a Resend API key with send permission only
   - [ ] `CONTACT_TO_EMAIL`: the monitored inbox that receives enquiries
   - [ ] `CONTACT_FROM_EMAIL`: e.g. `Fundex Global website <web@fundexglobal.vc>`. **Verify `fundexglobal.vc` in Resend first**, adding the SPF/DKIM DNS records it lists to the domain's DNS without touching the existing Google Workspace MX records
   - [ ] `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`: strongly recommended. Without them, rate limits apply per serverless instance only
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
- [ ] Lighthouse on the preview URL: mobile Performance ≥ 90, Accessibility 100, Best Practices ≥ 95, SEO 100
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

| Situation | Action | Time |
|---|---|---|
| Any production problem after merge | **Vercel dashboard → Deployments → the previous production deployment (b71c3a2, 22 May 2026, or whichever was live before) → "Promote to Production"** (Instant Rollback). No rebuild needed | < 1 min |
| Need the code reverted as well | `git revert -m 1 <merge-commit>` on `main` and push. Vercel redeploys the old site | ~3 min |
| Only the contact form misbehaves | Remove `RESEND_API_KEY` in Vercel and redeploy. The form returns 503 and tells visitors that nothing was sent, while the rest of the site stays up | ~2 min |
| Spam surge | Add the Turnstile keys and redeploy. Lower `CONTACT_RULES` limits in `src/lib/contact/rateLimit.ts` if needed | ~5 min |

The previous site remains available in Git history (`main` @ `b71c3a2`) and as the existing Vercel production deployment, so a rollback restores it byte-for-byte.

## F. After launch (first two weeks)

- Watch Vercel function logs for `contact.*` events (`contact.sent`, `contact.spam`, `contact.rate_limited`, `contact.delivery-failed`, `contact.not-configured`).
- Once there is enough traffic, check field Core Web Vitals in Search Console. None exist for this origin today.
