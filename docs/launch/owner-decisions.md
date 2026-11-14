# Owner decisions (one batched list)

**For:** Nahid Tanjum, owner of Fundex Global Pty Ltd · **From:** the website redesign (branch `redesign/corporate-site-v2`) · **Date:** 14 Nov 2026

Each item says what is needed, why, and what the site does until you decide. Every one of them is a one-line change in `src/data/site.ts` unless noted.

## Blocking launch

| # | Decision | Why it matters | Current default on the branch |
|---|---|---|---|
| 1 | **Confirm the four services** (or edit them): Strategy & venture design · Execution & growth support · Business planning & pitch preparation · Commercial partnerships & business development | These are the site's core promises. You are the person who delivers them (claims register B6a–d) | Shown as drafted |
| 2 | **Licensing status:** confirm Fundex holds no AFSL and is not an authorised representative. Also confirm it does not invest its own capital, broker businesses or arrange investments | The footer and legal page say so on every page. If any part is untrue, the wording must change before launch | The scope statement is shown |
| 3 | **Contact email:** send a test to `info@fundexglobal.vc`, reply from it, then confirm. Or name a different inbox | An MX record doesn't prove the mailbox exists or is read (ChatGPT round 1) | **Hidden.** The site offers the form and LinkedIn only |
| 4 | **Email delivery setup:** create a Resend account (or approve another provider), verify the domain, and add the env vars in Vercel (`docs/launch/deployment-checklist.md` §B) | Without it the form honestly says "nothing was sent" (HTTP 503) | The form refuses politely |
| 5 | **Approve the positioning line** "Where strategy meets execution." with the sub-line "We help founders and growing businesses turn complex challenges into clear plans, practical solutions and measurable progress." | Brand promise (ChatGPT round 1 approved it) | Shown |
| 6 | **Privacy policy and legal/scope page:** read them and get advice if needed. Confirm whether Fundex is covered by the Privacy Act (for example, turnover over $3m) | They are drafts written in good faith, not legal advice | Shown |

## Needed for trust (strongly recommended before launch)

| # | Decision | Why | Current default |
|---|---|---|---|
| 7 | **Founder bio** (60–100 words, verifiable, no unprovable figures) | Founder accountability was the #1 trust-builder in ChatGPT round 1 | Name and "Founder" only |
| 8 | **Founder photo:** a real, recent, professional headshot (square, ≥ 800 px) | Same as above | Navy "NT" monogram |
| 9 | **Office:** is "Level 9, Suite 1 & 2, 2 Queen Street, Melbourne VIC 3000" a real office you can meet clients at, or a virtual/registered address? | A published address must be accurate. ABN Lookup confirms only VIC 3000 | **Hidden.** Shows "Melbourne VIC, Australia · Meetings by arrangement" |
| 10 | **Phone +61 426 655 519:** whose number is it, and should it be public? | Unverified on the old site | **Hidden** |
| 11 | **Response-time promise** "We aim to reply within two business days." Keep it, change it, or remove it? | It is a public commitment | Shown |
| 12 | **Logo:** approve the flat SVG redraw of the four-tile mark, or supply master artwork. Also choose between "Fund'ex" (wordmark) and the serif wordmark used on LinkedIn | The old site (grey 3D sans) and LinkedIn (white serif) disagree | Flat redraw + Manrope wordmark |
| 13 | **Engagement terms:** confirm you will always agree scope, deliverables and fees in writing before starting (FAQ and principles promise this) | A public promise (B6f) | Shown |

## Evidence wanted (only if you want these claims back)

The old site published figures with no evidence. They have all been removed (claims register A1–A25). To restore any of them, supply evidence first:

- Portfolio companies (named, with each company's written consent to be listed)
- Exits, countries, "AUM" or invested amounts. Note that "AUM" also raises licensing questions
- Offices outside Melbourne (London and Singapore were claimed)
- Testimonials (written permission and a real name)
- Investment ranges or deal sizes (regulated; needs a licensing position)

## Nice to have (after launch)

- One original Insights article (methodology, not client work), per ChatGPT round 1. See `docs/content/insights-guide.md`.
- Update the LinkedIn company page's website field to `https://www.fundexglobal.vc`.
- Google Search Console verification and sitemap submission (your Google account).

## Repository note

The site's repository is `mdriad8/fundex`, owned by the GitHub account **mdriad8**. Your account has write access. Please confirm that the repository owner is happy for the framework to change from Vite/React to Astro, since past commits came from other contributors.
