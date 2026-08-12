import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { isIndexablePage } from './src/data/sitemapPages.ts';

import mdx from '@astrojs/mdx';

// Single timestamp for this build — used as <lastmod> for every sitemap URL so
// search engines see a consistent "last updated" date on each deploy.
const buildDate = new Date().toISOString();

// https://astro.build/config
export default defineConfig({
  // https://docs.astro.build/en/guides/images/#authorizing-remote-images
  site: 'https://www.mainfotech.com',
  adapter: vercel(),
  image: {
    domains: ['images.unsplash.com'],
  },
  prefetch: true,
  integrations: [
    sitemap({
      filter: isIndexablePage,
      changefreq: 'weekly',
      priority: 0.8,
      serialize(item) {
        const url = new URL(item.url);
        const path = url.pathname.replace(/\/$/, '') || '/';

        const priorities = {
          '/': 1,
          '/services': 0.9,
          '/products': 0.9,
          '/contact': 0.7,
        };

        return {
          ...item,
          priority: priorities[path] ?? 0.8,
          lastmod: buildDate,
        };
      },
    }),
    mdx(),
  ],
  experimental: {
    clientPrerender: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
