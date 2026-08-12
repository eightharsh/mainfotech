// https://docs.astro.build/en/guides/integrations-guide/sitemap/#usage
import type { APIRoute } from 'astro';
import { SITE } from '@data/constants';

/**
 * Allow the public site by default. Only block private / non-content paths.
 * New marketing pages are crawlable without updating an allow-list.
 */
const robotsTxt = `User-agent: *
Allow: /

Disallow: /api/
Disallow: /404
Disallow: /404/

Sitemap: ${new URL('sitemap-index.xml', SITE.url).href}
`.trim();

export const GET: APIRoute = () => {
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
