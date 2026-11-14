# Website benchmark — venture studios, builders and early-stage platforms

**Prepared:** 14 Nov 2026, for the Fundex Global website redesign (branch `redesign/corporate-site-v2`).
**Method:** Each homepage was loaded in headless Chrome at 1440 × 900 on 14 Nov 2026 by `scripts/benchmark-capture.mjs`. The script saved an above-the-fold screenshot to `docs/research/refs/*.jpg` and extracted structure from the DOM into `docs/research/refs/facts.json`: title, meta description, H1/H2, navigation, CTAs, computed fonts, JSON-LD types and canonical. Every observation below comes from those captures. Nothing is from memory. Where a capture was incomplete, the note says so.

**Scope:** 13 sites. That is the 7 mandatory sites plus 6 more, chosen for their model (studio, builder or accelerator) or because they are Australian.

| # | Site | Model | Mandatory |
|---|------|-------|-----------|
| 1 | hexa.com | Startup studio (software) | ✅ |
| 2 | foundersfactory.com | Venture studio + accelerator | ✅ |
| 3 | psl.com (Pioneer Square Labs) | Startup studio + VC fund | ✅ |
| 4 | highalpha.com | B2B SaaS venture firm (studio + capital) | ✅ |
| 5 | rainmaking.io | Corporate venture builder / consultancy | ✅ |
| 6 | antler.co | Global early-stage VC | ✅ |
| 7 | betatron.co | Venture group / accelerator (HK, SG) | ✅ |
| 8 | atomic.vc | Venture studio | |
| 9 | joinef.com (Entrepreneurs First) | Talent investor | |
| 10 | startmate.com.au | ANZ accelerator | |
| 11 | blackbird.vc | ANZ VC | |
| 12 | expa.com | Studio (design + capital) | |
| 13 | cicadainnovations.com | Australian deep-tech incubator | |

Dropped: McKinsey Leap returned "Access Denied" to the headless browser. science.inc now redirects to an unrelated Japanese company.

---

## 1. Site-by-site notes

### 1. Hexa — hexa.com
- **H1:** "Where the ambitious build exceptional companies". Title: "Hexa | startup studio building software companies".
- **IA:** The navigation is the offer: Start, Sprint, Scale, then Companies, Team and Media. There are two persistent CTAs, "Apply to Start" and "Apply to Sprint".
- **Visual:** A full-bleed pink-to-orange gradient, a condensed display face (Pptalisman Condensed) over Inter, and an "Ask anything about Hexa" AI box in the hero.
- **Proof:** "What we've built" (portfolio) and "Behind the build" (media).
- **Lesson for Fundex:** Name the offer by the stage the founder is at (start, sprint, scale). The nav then explains the service model with no extra copy.

### 2. Founders Factory — foundersfactory.com
- **H1:** "Power to founders". Supporting copy: "We build and fund startups together with exceptional entrepreneurs and the world's leading companies".
- **IA:** Founders, Partners, Focus areas, Portfolio, Careers, Company, plus an Apply button. Focus areas are Fintech, Health, Industrials and Deep Tech.
- **Visual:** Deep green ground, one soft yellow gradient blob, a grotesk (FoundersGrotesk) and a lot of negative space. A cookie banner appears on load.
- **Proof:** Hard numbers ("60+ operators") and press headlines ("Shop Circle raises $120 Million | Forbes").
- **Note:** No canonical tag was detected on the homepage.
- **Lesson:** One short H1 and one CTA. Restraint reads as premium. The proof is specific and sourced (press), not round "5+" counters.

### 3. Pioneer Square Labs — psl.com
- **H1:** "We partner with founders". Sub-line: "Pioneer Square Labs is a Startup Studio & Venture Capital Fund".
- **IA:** Hidden behind a "Menu" pill. About 142 words on the homepage.
- **Visual:** Warm near-black (#252423), cream type (Aeonik), editorial photography.
- **SEO:** Corporation JSON-LD and a canonical. **No meta description.**
- **Lesson:** An ultra-short homepage works when the brand is established. A new brand like Fundex needs more explanatory copy than PSL does.

### 4. High Alpha — highalpha.com
- **H1:** "Building with Founders to Go Faster and Further". There are two large cards for the two business lines, Capital and Studio.
- **IA:** Capital, Studio, Companies, Team, About, plus a gated content asset ("2026 Startup Benchmarks Survey") as the primary CTA.
- **Visual:** Off-white (#F6F6F6), near-black cards, a single blue accent and Neue Montreal.
- **Lesson:** Split the offer into two or three clearly labelled cards above the fold. Use a research or insight asset as the conversion path. The Fundex Insights section can grow into this.

### 5. Rainmaking — rainmaking.io
- **H1:** "Build your next growth engine". Sub-line: "We turn entrepreneurship into scaled growth".
- **IA:** Capabilities, Work, Company, Contact us. The capability names are methods ("Opportunity Mapping", lean de-risked build).
- **Visual:** Navy-to-blue gradient, Geist, and a logo bar of corporate clients (Barclays, Meta, Hitachi, IKEA, Coca-Cola).
- **Proof:** Big counters ("$10b+", "1800+", "85+"), backed by about two decades of operation and named clients.
- **Lesson:** Counters only work with real, checkable evidence. Fundex should borrow the **method-named capabilities**, not the counters.

### 6. Antler — antler.co
- **H1:** "Antler is a global early-stage VC investing in the world's best founders from first check to IPO." The visible display line is "Further — Faster".
- **IA:** Locations, Resources, Portfolio, Investors, About, Founder Login, plus a red "Pitch Us" button. Region selector.
- **Visual:** Warm off-white (#F9F7F5), Satoshi, an italic serif accent, and portfolio founder cards with photos.
- **SEO:** Organization and FinancialService JSON-LD. Has a skip link.
- **Lesson:** Mixing a humanist sans with an italic serif accent gives warmth without losing seriousness. Portfolio cards carry the proof. Fundex has none to show yet, so must not imitate them.

### 7. Betatron — betatron.co
- **H2:** "Investing in exit-focused B2B startups from Hong Kong and Singapore". The screenshot shows a dark night-city hero, similar to the Fund'ex LinkedIn banner.
- **IA:** Portfolio, Team, Blog, Podcasts, FAQ's, Careers, Contact, Invest, "Send us your deck".
- **Compliance (most relevant finding):** A modal on load carries **"No introducers or intermediaries"**, a **cybersecurity/fraud warning** and **legal information**. The legal text says the content has not been reviewed by Hong Kong's SFC, is for information only, and is not an offer or advice.
- **Lesson:** Firms near investment activity put scope and anti-fraud statements up front. Fundex should have a plain-language "what we do and don't do" disclaimer and a scam warning ("we will never ask you to transfer funds by email"). A blocking modal is not needed: a footer and a page are enough.

### 8. Atomic — atomic.vc
- **H1:** "Come build the next great company". Support line: "Atomic brings ideas, capital, and talent together…". CTA: "Build with us".
- **Visual:** Cream (#F8F5F2), Messina Sans, an orange accent pill CTA, and a horizontal portfolio carousel.
- **IA:** Team, Companies, Blog, News, Join. The footer lists `info@` and `careers@` addresses.
- **Lesson:** One verb-led CTA ("Build with us") plus visible role-based email addresses. That is a low-friction contact path a small firm can copy honestly.

### 9. Entrepreneurs First — joinef.com
- **H1:** "Found, don't follow". The copy speaks directly to the individual ("You might have an early idea…").
- **Visual:** Saturated violet, a serif display (PS Times) with a grotesk, and bracketed nav labels ("[START]", "[MENU]").
- **SEO:** WebPage, BreadcrumbList and WebSite JSON-LD, plus a canonical. A cookie dialog offers a clear "Reject all".
- **Lesson:** Second-person copy that names the visitor's situation converts. Offer a real reject option on any cookie banner. Fundex currently sets no cookies, so it needs no banner.

### 10. Startmate — startmate.com.au
- **H1:** "Startmate Nation: the best place in the world to build a startup". The meta description states the offer and deadline precisely ("$120k, a 14-week Accelerator…").
- **IA:** Offerings, Invest, Community, Portfolio, About, plus "Apply to Accelerator". Audience-segmented H2s: founders, investors, operators.
- **SEO:** Organization, WebSite and WebPage JSON-LD.
- **Lesson:** **Audience-segmented paths** (founder / investor / operator) are the Australian norm. Fundex's "for founders & investors" tagline maps onto two paths.

### 11. Blackbird — blackbird.vc
- **Hero:** Illustrated, surreal artwork, with the nav reduced to three pills (Investment, About Blackbird, Community). Line: "We invest in companies, not rounds."
- **Note:** The DOM extraction got very little text (33 words, no H1). The page renders mostly client-side, which is weak for crawlers and assistive technology.
- **Lesson:** A distinctive brand world works for an established firm. The missing H1 is a reminder that server-rendered HTML matters. Fundex's current site has the same client-only rendering problem.

### 12. Expa — expa.com
- **Capture:** Only a branded loading animation appeared within the 4-second capture window. Title "Expa". Meta description: "Expa combines design expertise, operational support, and capital to turn bold ideas into category-defining companies."
- **Footer:** Has an **"Idea submission policy"**, a legal page that sets expectations about unsolicited ideas and confidentiality.
- **Lesson:** (a) Don't gate first paint behind an intro animation. (b) An idea-submission and confidentiality notice is useful when inviting founders to share plans. Fundex's contact form should say: "please don't send confidential information in your first message".

### 13. Cicada Innovations — cicadainnovations.com
- **H1:** "Welcome to Australia's home for deep tech". Full-bleed photography of its real Eveleigh building.
- **IA:** About, Our Team, Focus Areas, Incubators (by location), Residents, Support & Programs, What's On.
- **Lesson:** A real place photographed honestly builds trust. If Fundex has a verified Melbourne office, a real photo of it would beat any stock image. Until then, use no imagery rather than stock.

---

## 2. Cross-site patterns

| Pattern | Seen on | Use for Fundex? |
|---|---|---|
| Short, verb-led H1 (≤ 8 words) | Founders Factory, PSL, Atomic, Rainmaking, High Alpha | **Yes.** H1 = the positioning line |
| One primary CTA in the header | 11 of 13 | **Yes:** "Start a conversation" |
| Offer split into 2–3 named lines above the fold | High Alpha, Hexa, Founders Factory | **Yes:** three service cards |
| Audience paths (founder / investor) | Startmate, Antler, Founders Factory | **Yes,** lightly: "For founders" / "For partners & investors" |
| Portfolio logos or founder cards as proof | Atomic, Antler, Founders Factory, PSL, Rainmaking | **No.** Nothing verifiable exists. Leave a slot, empty until evidence is supplied |
| Big counters ($, #, countries) | Rainmaking, Founders Factory | **No.** The current "$500k+ AUM / 5+ exits" counters are unverified (see claims register) |
| Warm off-white or near-black grounds, one accent | High Alpha, Antler, Atomic, PSL, Founders Factory | **Yes:** off-white + navy + gold accent |
| Grotesk / geometric sans; optional serif accent | All; serif accent on Antler and EF | **Yes:** Manrope display + Inter text; the serif stays in the logo only |
| Insights / content hub | Hexa (Media), Founders Factory, High Alpha, Atomic, Antler, Startmate | **Yes:** structure only, no fabricated posts |
| Legal / scope disclaimer near investment language | Betatron (prominent), Expa (idea policy) | **Yes:** "What we don't do" plus a scam warning |
| JSON-LD | PSL, Antler, Betatron, EF, Startmate | **Yes:** Organization + WebSite + WebPage + BreadcrumbList |
| Missing basics (meta description, canonical, H1) | PSL (no description), Founders Factory/High Alpha/Antler/Atomic (no canonical detected), Blackbird/Betatron (no H1 detected) | Easy wins for Fundex |

## 3. Implications for the Fundex redesign

1. **Lead with what Fundex does, not with capital.** Every investor site leads with capital *plus* proof (portfolio, fund size, exits). Fundex can publish neither (unverified and regulated). Its credible ground is the studio/consultancy half of the market: strategy, venture design and hands-on execution. That points to positioning around **strategy + execution** (see `docs/strategy/positioning.md`).
2. **Earn trust with honesty rather than counters.** Use process transparency ("how an engagement runs"), a named, real founder, verifiable company details (legal entity, city) and a clear scope statement, as on Betatron and Expa.
3. **Keep it restrained and premium.** Off-white and navy grounds, a single gold accent tied to the LinkedIn banner's gold-lit city, generous whitespace, one primary CTA.
4. **Make the conversion path real.** A working, validated form plus a visible role address (Atomic pattern). Set honest response expectations and include a confidentiality note (Expa pattern).
5. **Treat technical SEO as a differentiator.** Several leading firms miss canonicals or meta descriptions. Server-rendered HTML with complete metadata and JSON-LD is cheap to get right.
