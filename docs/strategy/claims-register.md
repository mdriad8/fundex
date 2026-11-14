# Claims register

**Rule for this redesign:** a claim goes on the site only if it is **Verified**, with its evidence named here. Everything else is removed, or kept out of the new build until the owner supplies evidence. **No figure, portfolio company, team member, testimonial, partner, office or investment amount is invented.**

Status key:
- **Verified**: evidence on file (source given).
- **Unverified**: no evidence seen; it may be true, but the owner must supply proof.
- **Contradicted**: conflicts with another known fact.
- **Regulatory risk**: wording that could amount to advertising a financial service, financial product advice or dealing/arranging under the *Corporations Act 2001* (Cth) Chapter 7, or a business-broking claim. Needs owner and legal confirmation before any use.

Sources for "known facts": the Fund'ex LinkedIn company page as checked on 5 Nov 2026 (company id 111150296: founded 2026, company size 2, Business Consulting, no website listed), and the founder's own statement that Fundex Global Pty Ltd is solely owned by Nahid Tanjum, Melbourne. DNS checked 14 Nov 2026: `fundexglobal.vc` MX → `smtp.google.com`.

## A. Claims on the current live site (fundexglobal.vc, `main` @ b71c3a2)

| # | Claim (verbatim or close) | Where | Status | Decision in redesign |
|---|---|---|---|---|
| A1 | "$500k+ Assets Under Management" | Home stats, About stats, About timeline | Unverified · **Regulatory risk** ("AUM" implies managing others' money) | **Removed** |
| A2 | "5+ Portfolio Companies" | Home, About | Unverified | **Removed**; needs a named list plus consent |
| A3 | "3+ Countries" | Home, About | Unverified | **Removed** |
| A4 | "5+ Successful Exits" | Home, About | Unverified; implausible for a company founded in 2026 | **Removed** |
| A5 | "Proven Track Record — Decades of combined experience in building and scaling global enterprises" | Home | Unverified (company size 2) | **Removed** |
| A6 | "Fund'ex established [2024] by former operators and investors" | About timeline | **Contradicted**: LinkedIn says founded 2026 | **Removed** |
| A7 | "2025 — Opened offices in London and Singapore" | About timeline | **Contradicted**: Contact page lists Melbourne only | **Removed** |
| A8 | "2025 — Advisory launch", "Brokerage division" | About timeline | Unverified (pre-dates founding year) | **Removed** |
| A9 | "Reached 5+ portfolio companies across 3 countries with $500k+ AUM" | About timeline | Unverified · Regulatory risk | **Removed** |
| A10 | "Venture Capital — Seed to Series B investments", "Follow-on capital reserves" | Services | Unverified · **Regulatory risk** (offering to invest; implies a fund) | **Removed**; owner to confirm whether Fundex invests its own balance-sheet capital (see Owner decisions) |
| A11 | "Investment Range: $500K – $25M" | Services | Unverified · **Regulatory risk** | **Removed** |
| A12 | "Focus: Technology, Healthcare, Climate, FinTech" | Services | Unverified | **Removed** until owner confirms focus areas |
| A13 | "Business Brokerage — Buy-side and sell-side advisory, valuation, deal structuring and negotiation" | Services, Footer | Unverified · **Regulatory risk** (business-agent rules vary by state; sale of shares can be a financial product) | **Removed**; owner to confirm whether brokerage is offered and under what authority |
| A14 | "Deal Size: $5M – $500M+" | Services | Unverified; implausible for a 2-person firm | **Removed** |
| A15 | "M&A Transactions" | Footer | Unverified · Regulatory risk | **Removed** |
| A16 | "3–12 month engagements" | Services (Advisory) | Unverified | **Removed**; the new copy describes engagement *shape*, not durations |
| A17 | "Typical profile: Pre-seed to Series B" / "Family offices, VCs, angels, strategic corporates" | Services | Unverified | **Removed** |
| A18 | "Every partner at Fund'ex has built, scaled, and exited companies" | Approach | Unverified; there is one owner | **Removed** |
| A19 | "5–10 active investments per year" | Approach stats | Unverified · Regulatory risk | **Removed** |
| A20 | "87% Founder-led board seats" | Approach stats | Unverified; no basis | **Removed** |
| A21 | "2+ yrs average hold period" | Approach stats | Unverified · Regulatory risk | **Removed** |
| A22 | "24/7 founder access" | Approach stats | Unverified; contradicts the stated office hours | **Removed** |
| A23 | "Clean term sheets, founder-friendly structures, and rapid deployment" | Approach | Regulatory risk (offering investment terms) | **Removed** |
| A24 | "Patient capital deployed with strategic precision" | Home | Regulatory risk | **Removed** |
| A25 | "Partner with founders, funds, and investors… from first cheque to final exit" | Home, Footer | Regulatory risk ("first cheque") | **Removed** |
| A26 | "Building the Future, One Company at a Time" | Home H1 | Neutral, but generic | Replaced by the positioning line |
| A27 | Office: "Level 9, Suite 1 & 2, 2 Queen Street, Melbourne VIC 3000" | Contact | Unverified (may be a virtual or serviced office) | **Hidden** behind a config flag (`site.ts → office.showStreetAddress=false`) until the owner confirms |
| A28 | Phone "+61 426 655 519" | Contact, Services CTA | Unverified (whose number?) | **Hidden** behind a config flag until confirmed |
| A29 | Email "info@fundexglobal.vc" | Contact | **Unverified**: the domain has Google Workspace MX, but an MX record proves neither that the mailbox exists nor that anyone monitors it (ChatGPT review round 1) | **Hidden** (`site.ts → contact.emailVerified=false`) until the owner sends and receives a test message |
| A30 | Office hours "Mon–Fri 9–5, Sat by appointment" | Contact | Unverified; conflicts with the founder's Mon–Thu schedule | **Removed** |
| A31 | "We typically respond within 24–48 hours" | Contact | Unverified | Replaced by "We aim to reply within two business days"; owner to confirm |
| A32 | "Times shown are AEST. We operate across multiple time zones globally." | Contact | Unverified | **Removed** |
| A33 | "Career Opportunities" CTA and inquiry type | About, Contact | No careers process exists | **Removed** |
| A34 | LinkedIn / Twitter / Email social icons linking to `#` | Footer | Broken links | LinkedIn → the real company page (verified id 111150296); Twitter removed |
| A35 | "Privacy Policy" / "Terms of Service" linking to `#` | Footer | Broken links | Replaced by real `/privacy` and `/legal` pages (drafts for owner/legal review) |

## B. Claims made by the redesigned site

| # | Claim | Where | Status | Evidence |
|---|---|---|---|---|
| B1 | Legal name "Fundex Global Pty Ltd" | Footer, legal pages, JSON-LD | **Verified** | ABN Lookup (abr.business.gov.au), checked 14 Nov 2026: entity name FUNDEX GLOBAL PTY LTD, Australian Private Company, active |
| B1a | ABN 49 694 783 205 · ACN 694 783 205 | Footer, About, Legal, JSON-LD `taxID` | **Verified** | ABN Lookup, 14 Nov 2026: ABN active from 06 Feb 2026, GST registered from 06 Feb 2026, main business location VIC 3000 |
| B2 | Based in Melbourne, Australia | Footer, Contact, JSON-LD | **Verified** | Owner statement, plus ABN Lookup main business location VIC 3000 (the Melbourne CBD postcode) |
| B3 | Founded 2026 | About, JSON-LD `foundingDate` | **Verified** | ABN Lookup: ABN active from 06 Feb 2026 (independent record). The LinkedIn page ("founded 2026") is supporting evidence only, per ChatGPT review round 1 |
| B4 | Founder: Nahid Tanjum | About | Verified (owner) | Bio text and photo pending (owner decision) |
| B5 | LinkedIn company page URL | Footer, JSON-LD `sameAs` | Verified | linkedin.com/company/111150296 |
| B6a | Service: Strategy & venture design | Services, Home | **Pending owner confirmation** | Delivered by: the founder. The owner must confirm this is offered and that he has the capability to deliver it |
| B6b | Service: Execution & growth support | Services, Home | **Pending owner confirmation** | Delivered by: the founder. Owner to confirm, including capacity for hands-on delivery |
| B6c | Service: Business planning & pitch preparation (renamed from "Investment readiness" in review round 1) | Services, Home | **Pending owner confirmation** | Delivered by: the founder. Restricted to business plans, presentations and operational information. No valuation, advice or arranging |
| B6d | Service: Commercial partnerships & business development (renamed and narrowed in review round 1) | Services, Home | **Pending owner confirmation** | Delivered by: the founder. Commercial introductions only, never investment introductions |
| B6e | Principle "Small by design: you work directly with the founder" | Home, About | **Pending owner confirmation** | True of a 1–2 person firm today; must change if delivery is ever delegated |
| B6f | "We agree the scope, deliverables and fees in writing before any work starts" | Services FAQ, Contact | **Pending owner confirmation** | Owner must commit to written engagement letters |
| B7 | "We aim to reply within two business days" | Contact | **Pending owner confirmation** | — |
| B8 | "Fundex does not hold an Australian Financial Services Licence and does not provide financial product advice, deal in securities or manage funds" | Legal page, footer note | **Pending owner/legal confirmation** of AFSL status | Owner must confirm. If Fundex holds an AFSL or is an authorised representative, this text must be replaced with the licence details |

## C. Out of scope by instruction (must not appear anywhere)

- Baazar (any brand, link or asset)
- Silent Intent
- Fundex AI Hackathon: no event page, dates, prizes or links

`tests/content.test.ts` enforces sections A and C. It scans the built HTML and fails if any banned term or removed figure (for example "AUM", "$500k", "Series B", "exits", "hackathon", "Baazar", "Silent Intent") appears.
