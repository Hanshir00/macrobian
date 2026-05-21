import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * These schemas mirror what Keystatic writes. If you add a field in
 * keystatic.config.tsx, mirror it here too so Astro's getCollection()
 * stays type-safe.
 *
 * Glob loaders let us point each collection at the exact folder Keystatic
 * uses (e.g. kebab-case paths like `src/content/repo-topics/`) without
 * forcing the collection key to match.
 */

const peptides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/peptides' }),
  schema: z.object({
    title: z.string().optional(),
    summary: z.string().optional().default(''),
    category: z.string().optional(),
    aliases: z.array(z.string()).optional().default([]),
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    order: z.number().optional(),
    draft: z.boolean().default(false),
  }),
});

const nootropics = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/nootropics' }),
  schema: z.object({
    title: z.string().optional(),
    summary: z.string().optional().default(''),
    category: z.string().optional(),
    aliases: z.array(z.string()).optional().default([]),
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    order: z.number().optional(),
    draft: z.boolean().default(false),
  }),
});

const repoTopics = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/repo-topics' }),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    description: z.string().optional(),
    order: z.number().optional(),
  }),
});

const repoSubtopics = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/repo-subtopics' }),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    topic: z.string(),
    description: z.string().optional(),
    order: z.number().optional(),
  }),
});

const repoLinks = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/repo-links' }),
  schema: z.object({
    title: z.string(),
    url: z.string().url(),
    topic: z.string(),
    subtopic: z.string().optional(),
    type: z.enum(['Article', 'Study', 'Book', 'Video', 'Podcast', 'Other']).default('Article'),
    author: z.string().optional(),
    year: z.number().optional(),
    description: z.string().optional(),
    addedAt: z.coerce.date().optional(),
  }),
});

/**
 * `pages` and `settings` are stored under src/content/ but read directly
 * by helper functions (src/config/settings.ts and src/config/pages.ts),
 * not via getCollection(). Defining them here as empty/permissive
 * collections silences Astro's auto-generation warnings.
 */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/pages' }),
  schema: z.any(),
});

const settings = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/settings' }),
  schema: z.any(),
});

export const collections = {
  peptides,
  nootropics,
  repoTopics,
  repoSubtopics,
  repoLinks,
  pages,
  settings,
};
