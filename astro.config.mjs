// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
site: 'https://macrobian.science',
  // Server output so the Keystatic admin (/keystatic, /api/keystatic) runs on
  // the server. The landing page itself is prerendered (see prerender = true).
  output: 'server',
  adapter: netlify(),
integrations: [react(), markdoc(), keystatic(), sitemap()],
  vite: {
    build: {
      // /pagefind/pagefind.js is generated AFTER the Astro build by the
      // pagefind CLI (see package.json). It's loaded at runtime, so the
      // bundler must not try to resolve it during build.
      rollupOptions: { external: ['/pagefind/pagefind.js'] },
    },
  },
});
