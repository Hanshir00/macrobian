import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Update this after you connect your domain in Netlify
  site: 'https://sanguine.example.com',
  integrations: [sitemap()],
  build: {
    assets: 'assets'
  }
});
