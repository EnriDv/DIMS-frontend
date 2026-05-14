// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
const enableMiddlewareMode = process.env.ASTRO_MIDDLEWARE_MODE === 'true';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    ...(enableMiddlewareMode ? { server: { middlewareMode: true } } : {}),
  },

  integrations: [react()],

  output: 'server',
  adapter: node({ 
    mode: 'standalone',
  }),

  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});