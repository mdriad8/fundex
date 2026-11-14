import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Insights articles. Structure only: no articles ship with the redesign.
 * Add Markdown files to src/content/insights/ to publish (see docs/content/insights-guide.md).
 * Every article needs a named author and a review date, and must follow the claims rules.
 */
const insights = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/insights' }),
  schema: z.object({
    title: z.string().max(90),
    description: z.string().min(50).max(160),
    topic: z.enum(['strategy', 'execution', 'business-planning', 'partnerships']),
    author: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { insights };
