// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://keisukesawa.github.io',
  base: '/SnapQR2Link',

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