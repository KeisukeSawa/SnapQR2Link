// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://snapqr2link.example.com', // TODO: Update with actual domain

  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'ja',
        locales: {
          ja: 'ja',
          en: 'en'
        }
      }
    })
  ],

  i18n: {
    locales: ['ja', 'en'],
    defaultLocale: 'ja'
  },

  vite: {
    plugins: [tailwindcss()]
  }
});