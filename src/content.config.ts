import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Read via import.meta.glob in src/config/landing.ts; this definition just
// keeps Astro from warning about an undefined collection folder.
const landing = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/landing' }),
  schema: z.any(),
});

export const collections = { landing };
