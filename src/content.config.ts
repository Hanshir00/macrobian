import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Read via import.meta.glob in src/config/landing.ts; this definition just
// keeps Astro from warning about an undefined collection folder.
const landing = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/landing' }),
  schema: z.any(),
});

// Each content collection, defined independently. Every .mdoc file becomes a
// live page at /<slug> via src/pages/[...slug].astro. These are fully separate
// from one another — this file only tells Astro that the folders exist.
const pages = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/pages' }),
  schema: z.object({ title: z.string(), intro: z.string().optional() }),
});
const pharmacopeia = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/pharmacopeia' }),
  schema: z.object({ title: z.string(), intro: z.string().optional() }),
});
const references = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/references' }),
  schema: z.object({ title: z.string(), intro: z.string().optional() }),
});
const ilm = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/ilm' }),
  schema: z.object({ title: z.string(), intro: z.string().optional() }),
});
const links = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/links' }),
  schema: z.object({ title: z.string(), intro: z.string().optional() }),
});
const tools = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/tools' }),
  schema: z.object({ title: z.string(), intro: z.string().optional() }),
});
const drafts = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/drafts' }),
  schema: z.object({ title: z.string(), intro: z.string().optional() }),
});
const other = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/other' }),
  schema: z.object({ title: z.string(), intro: z.string().optional() }),
});

export const collections = {
  landing,
  pages,
  pharmacopeia,
  references,
  ilm,
  links,
  tools,
  drafts,
  other,
};
