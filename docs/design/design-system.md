# Fundex Global design system

Tokens are defined in `src/styles/global.css` (`:root`). Components live in `src/components/`. Content and company facts live in `src/data/site.ts`, the single source of truth.

## 1. Principles

1. **Quiet confidence.** A restrained navy, off-white and gold palette with generous whitespace and one primary action per view. The benchmark shows restraint reads as premium (Founders Factory, High Alpha, PSL).
2. **Truth over decoration.** No stock photography, fake logos or counters. Imagery is abstract (the skyline line motif from the LinkedIn banner's gold-lit city), so it never implies clients, offices or people that don't exist.
3. **Accessible by default.** Every colour pair used for text meets WCAG 2.2 AA. Targets are at least 24 px (most are 44–48 px). Focus is always visible. Motion respects `prefers-reduced-motion`.
4. **Fast by default.** Static HTML (about 7–9 KB gzipped per page), CSS inlined into each page, two self-hosted variable fonts (Manrope 25 KB + Inter 48 KB WOFF2), and 3.1 KB of JavaScript (menu 0.5 KB on every page; form 2.6 KB on Contact only). Sizes measured from the 14 Nov 2026 build.

## 2. Colour

The suggested palette was evaluated with WCAG 2.x relative-luminance contrast. Ratios were computed on 14 Nov 2026.

| Token | Hex | Use | Key contrast |
|---|---|---|---|
| `--navy-950` | #0B1422 | Header, hero, footer, primary button | Paper on navy-950: **17.2:1** |
| `--navy-900` | #142236 | Raised dark surfaces (CTA band) | Paper on navy-900: **14.9:1** |
| `--navy-800` | #1D2F48 | Dark borders, primary-button hover | Decorative |
| `--gold-400` | #C9A76D | Accent **on dark only**: eyebrow text, rules, gold buttons | Gold on navy-950: **8.1:1**; navy-950 text on gold: **8.1:1** |
| `--gold-300` | #DCC296 | Gold hover on dark | — |
| `--gold-700` | #7A5C28 | Gold accent **on light** (eyebrows, ticks, numbers) | On paper: **5.8:1** |
| `--paper` | #F6F7F9 | Page background | — |
| `--white` | #FFFFFF | Cards, form fields | — |
| `--ink` | #142033 | Body text on light | On paper: **15.3:1** |
| `--muted` | #5B6B80 | Secondary text on light | On paper: **5.1:1**; on white: **5.4:1** |
| `--muted-on-dark` | #AAB6C6 | Secondary text on dark | On navy-900: **7.8:1**; on navy-950: **9.0:1** |
| `--line` | #D9DEE5 | Decorative hairlines only | Not used for meaning |
| `--line-strong` | #66758A | Form-field borders (WCAG 1.4.11 non-text) | On white: **4.7:1** |
| `--error` | #B42318 | Error text and borders | On white: **6.6:1** |
| `--success` | #1F7A4D | Success text | On white: **5.3:1** |

**Changes from the suggested palette:**
- **Muted #66758A → #5B6B80 for text.** #66758A on off-white #F6F7F9 measures **4.38:1**, which fails AA for normal text (needs 4.5:1). #66758A is kept only for form borders, where 3:1 is the requirement.
- **Gold #C9A76D is never used as text on light backgrounds.** It measures **2.12:1** on off-white and **2.27:1** on white. A darker gold, `--gold-700` (#7A5C28, 5.8:1), carries the accent on light surfaces.
- Everything else (#0B1422, #142236, #C9A76D, #F6F7F9, #142033) is adopted as suggested.

## 3. Typography

**Evaluated:** Manrope, Inter, Sora, Plus Jakarta Sans.

| Font | Verdict | Reason |
|---|---|---|
| **Manrope** (display) | ✅ Chosen for headings | Geometric-grotesk with rounded terminals that echo the existing "fund'ex" wordmark. Confident at 700–800 weights. One variable latin WOFF2 of 25 KB |
| **Inter** (text) | ✅ Chosen for body and UI | Best small-size legibility of the four, with tabular figures and wide language support. A neutral partner to Manrope |
| Sora | ❌ | Wide letterforms read "crypto/tech product" rather than advisory. Long service titles wrap more often at 320 px |
| Plus Jakarta Sans | ❌ | Attractive, but too close to Manrope to pair with it. Using it alone loses the display/text contrast |

**Loading:** both fonts are self-hosted through Astro's Fonts API (`astro.config.mjs`) as latin-subset variable WOFF2s. They are preloaded, use `font-display: swap`, and have **metric-matched Arial fallbacks** (size-adjust/ascent overrides) to keep layout shift near zero.

**Scale (fluid, `clamp`):**

| Token | Range | Use |
|---|---|---|
| `--step--1` | 14 → 15 px | Meta, labels, eyebrows |
| `--step-0` | 16 → 17 px | Body |
| `--step-1` | 18 → 20 px | Lede, H3 |
| `--step-2` | 22 → 28 px | Sub-section headings |
| `--step-3` | 28 → 40 px | H2 |
| `--step-4` | 36 → 60 px | Page H1 |
| Home H1 | 40 → 80 px | Home hero only |

Headings use `text-wrap: balance`, body text uses `text-wrap: pretty`, and both use `overflow-wrap: break-word`. Body line-height is 1.65 and heading line-height 1.12. Eyebrows are uppercase with 0.08em tracking and a 24 px rule.

## 4. Space, layout and shape

- **Spacing:** a 4 px base (`--space-1` 4 px … `--space-8` 64 px). Section padding is `--space-section`, a fluid 56 → 112 px.
- **Container:** 72 rem (1152 px) content width, with a fluid gutter of 16 → 32 px. The narrow container (46 rem) is for long-form text.
- **Grid:** 1 column below 640 px, 2 columns from 640 px, 3–4 columns from 1024 px. Steps use 2 columns from 768 px and 4 from 1100 px.
- **Breakpoints:** 640 · 768 · 900 (navigation switches here) · 1024 · 1100 px. Verified at **320, 375, 390, 430, 768, 1024 and 1440 px** (see `docs/qa/qa-report.md`).
- **Radius:** 6 px (buttons, inputs), 10 px (FAQ), 16 px (cards).
- **Elevation:** a single soft card shadow. No other shadows.

## 5. Components

| Component | File | Notes |
|---|---|---|
| Logo | `components/Logo.astro` | A flat SVG redraw of the existing four-tile mark plus the "Fund'ex" wordmark in Manrope 700. Light and dark tones. **Owner to approve or supply master artwork** |
| Header / navigation | `components/Header.astro` | Sticky, navy. Below 900 px it becomes a disclosure menu: `aria-expanded`, `aria-controls`, Escape closes it and returns focus. Without JS, the nav is always visible (a `<noscript>` style). The current page is marked with `aria-current="page"` |
| Footer | `components/Footer.astro` | Company, services, connect, and the legal line with ABN plus the scope statement |
| Page hero | `components/PageHero.astro` | Navy band with eyebrow, H1, lede and a slot for CTAs. A decorative skyline SVG (`aria-hidden`) at reduced opacity on mobile |
| Steps | `components/Steps.astro` | The four-step engagement model (Understand → Shape → Execute → Review) |
| CTA band | `components/CtaBand.astro` | One closing action per page |
| Buttons | `.btn--primary`, `.btn--secondary`, `.btn--gold` | 48 px minimum height. On dark sections the primary button becomes gold automatically |
| Cards | `.card` | White, 1 px line, 16 px radius, soft shadow |
| Tick list | `.tick-list` | CSS-drawn ticks in gold-700 (gold-400 on dark) |
| Notice | `.notice` | Gold-edged note for scope and scam statements |
| Form fields | `pages/contact.astro` | Visible labels, hints linked with `aria-describedby`, inline errors plus a focusable error summary, 16 px inputs (no iOS zoom), 24 px checkbox |

## 6. Motion

Motion is limited to colour transitions on hover (150 ms) and the menu icon transform. `scroll-behavior: smooth` applies only when the user has not asked for reduced motion. There is no autoplaying, looping or parallax motion (the previous site's infinite "ping" animation was removed).

## 7. Voice and content rules

- Plain Australian English, short sentences, and second person ("you") for the visitor.
- **Never** publish an unverified number, client, partner, testimonial, team member, office or investment term (see `docs/strategy/claims-register.md`). `tests/content/claims.test.ts` enforces the removed list.
- Service copy describes activities and outcomes, never guarantees.
- No regulated-service language: no advice, recommending, arranging, dealing, fund or capital-raising offers.
