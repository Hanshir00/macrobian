import { defineCollection, z } from 'astro:content';

/**
 * Peptides — write-ups of individual peptides.
 * Each markdown file in src/content/peptides/ becomes a page.
 */
const peptides = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    category: z.string().optional(),       // e.g. 'Healing', 'Cognitive', 'Performance'
    aliases: z.array(z.string()).optional(),
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    order: z.number().optional(),          // for manual ordering on index page
    image: z.string().optional(),          // path under /public
  }),
});

/**
 * Nootropics — write-ups of individual nootropics.
 */
const nootropics = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    category: z.string().optional(),
    aliases: z.array(z.string()).optional(),
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    order: z.number().optional(),
    image: z.string().optional(),
  }),
});

/**
 * Repository — three flat collections that compose into a tree:
 *
 *   Topic (e.g. "Humanities")
 *     └─ Subtopic (e.g. "Ray Peat")  [optional]
 *         └─ Link  (article/study/book reference)
 *
 *  Each Subtopic references its Topic by slug.
 *  Each Link references a Topic and optionally a Subtopic.
 *  This keeps Decap CMS simple while supporting nested browsing.
 */

const repoTopics = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    slug: z.string(),                       // url-safe id; used for linking
    description: z.string().optional(),
    order: z.number().optional(),
  }),
});

const repoSubtopics = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    topic: z.string(),                      // parent topic slug
    description: z.string().optional(),
    order: z.number().optional(),
  }),
});

const repoLinks = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    url: z.string().url(),
    topic: z.string(),                      // topic slug
    subtopic: z.string().optional(),        // optional subtopic slug
    author: z.string().optional(),
    year: z.number().optional(),
    type: z.enum(['Article', 'Study', 'Book', 'Video', 'Podcast', 'Other']).default('Article'),
    description: z.string().optional(),
    addedAt: z.coerce.date().optional(),
  }),
});

export const collections = {
  peptides,
  nootropics,
  'repo-topics': repoTopics,
  'repo-subtopics': repoSubtopics,
  'repo-links': repoLinks,
};
