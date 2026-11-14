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
