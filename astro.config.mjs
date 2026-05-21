// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  // Update this after you connect your domain in Netlify
  site: 'https://sanguine.example.com',

  // Server output is required so the Keystatic admin routes (/keystatic/*
  // and /api/keystatic/*) can run on the server. All public pages still
  // pre-render to static HTML — see `export const prerender = true` in
  // each public page file.
  output: 'server',

  adapter: netlify(),

  integrations: [
    react(),
    markdoc(),
    keystatic(),
    sitemap(),
  ],

  build: {
    assets: 'assets',
  },
});
