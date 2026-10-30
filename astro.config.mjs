// @ts-check
import { defineConfig } from 'astro/config';

import netlify from '@astrojs/netlify';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  adapter: process.env.NODE_ENV === 'production' ? netlify() : undefined,
  integrations: [svelte()]
});
