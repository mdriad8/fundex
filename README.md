# Fundex Global website

Corporate website for **Fundex Global Pty Ltd** (Melbourne): www.fundexglobal.vc.

Built with [Astro](https://astro.build): static HTML for every page, plus one on-demand Vercel Function for the contact form.

## Quick start

```bash
npm ci
npm run dev            # http://localhost:4321
npm run build          # production build → .vercel/output
npm test               # unit + content tests (run build first for content tests)
npx playwright test    # end-to-end + accessibility (axe, 7 viewport widths)
```

Copy `.env.example` to `.env` to test real email delivery locally. Without these variables the contact form returns HTTP 503 and tells the visitor that nothing was sent.

## Where things live

| Path | What |
|---|---|
| `src/data/site.ts` | **Company facts, contact details, services and copy flags.** Only verified facts are shown; unverified items have `show*` flags set to `false` |
| `src/pages/` | Home, Services, About, Insights, Contact, Privacy, Legal, 404, and `api/contact.ts` |
| `src/lib/contact/` | Contact form: validation, spam checks, rate limiting, email delivery (Resend) and the HTTP handler |
| `src/content/insights/` | Insights articles (Markdown). Empty at launch, by design |
| `src/styles/global.css` | Design tokens and base styles |
| `docs/` | Research, audit, strategy, claims register, design system, QA results, ChatGPT review log, launch checklist and owner decisions |
| `tests/` | Vitest unit and content tests; Playwright end-to-end and accessibility tests |

## Rules for content changes

Read `docs/strategy/claims-register.md` first. Do not publish figures, clients, partners, testimonials, team members, offices or investment terms without evidence. Do not describe regulated financial services. `tests/content/claims.test.ts` fails the build check if removed claims come back.
