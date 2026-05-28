// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://sanguine.example.com',
  // Server output so the Keystatic admin (/keystatic, /api/keystatic) runs on
  // the server. The landing page itself is prerendered (see prerender = true).
  output: 'server',
  adapter: netlify(),
  integrations: [react(), keystatic()],
});
