# Publishing Insights

The Insights section ships **empty, by design**: no placeholder or invented articles. While it is empty, `/insights` shows an honest "in preparation" message, is marked `noindex`, and is left out of the sitemap. All three switch automatically when the first article is added.

## Add an article

Create `src/content/insights/<slug>.md`:

```md
---
title: "How to turn a strategy into a 90-day plan"        # ≤ 90 characters
description: "A practical method for choosing three priorities, assigning owners and measuring progress each fortnight."  # 50–160 characters
topic: strategy            # strategy | execution | business-planning | partnerships
author: "Nahid Tanjum"
publishedAt: 2026-12-01
# updatedAt: 2026-12-15
# draft: true              # drafts are built but never listed or published
---

Article body in Markdown…
```

Then run `npm run build && npm test`. The content test checks every page for removed claims and out-of-scope topics.

## Editorial rules (same as the claims register)

1. Named author and a real publication date.
2. No client names, results, figures or quotes without written permission and evidence. Record them in `docs/strategy/claims-register.md`.
3. No financial-product advice, investment recommendations or "how to invest" content.
4. Write original material. Quotes from others must be short and attributed.
5. Mark AI-assisted drafting in the review notes. The author remains responsible for every statement.

ChatGPT review round 1 recommended publishing **one genuinely useful, original methodology piece** as an early trust-builder, clearly separate from client work.
