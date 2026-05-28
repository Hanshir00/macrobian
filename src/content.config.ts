import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Read via import.meta.glob in src/config/landing.ts; this definition just
// keeps Astro from warning about an undefined collection folder.
const landing = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/landing' }),
  schema: z.any(),
});

// Pages created in the Keystatic admin. Each .mdoc file becomes a live page
// at /<slug> via src/pages/[...slug].astro.
const pages = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    intro: z.string().optional(),
  }),
});

export const collections = { landing, pages };
