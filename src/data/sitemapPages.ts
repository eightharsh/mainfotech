/**
 * Core pages that should appear in the sitemap and be allowed in robots.txt.
 */
export const INDEXABLE_PATHS = [
  '/',
  '/services/',
  '/products/',
  '/review/',
  '/contact/',
] as const;

export type IndexablePath = (typeof INDEXABLE_PATHS)[number];

const INDEXABLE_PREFIXES = [] as const;

function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

function isExcludedPath(pathname: string): boolean {
  return (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_astro/') ||
    pathname.endsWith('/cover.jpg/') ||
    pathname.endsWith('/cover.jpg') ||
    pathname === '/manifest.json/' ||
    pathname === '/favicon.ico/' ||
    pathname === '/robots.txt/' ||
    pathname === '/404/'
  );
}

/** Returns true when a built page URL should be included in the sitemap. */
export function isIndexablePage(pageUrl: string): boolean {
  const pathname = normalizePathname(new URL(pageUrl).pathname);

  if (isExcludedPath(pathname)) return false;

  if ((INDEXABLE_PATHS as readonly string[]).includes(pathname)) return true;

  return INDEXABLE_PREFIXES.some(prefix => pathname.startsWith(prefix));
}
