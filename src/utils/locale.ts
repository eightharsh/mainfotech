/**
 * Marketing-site locale helpers.
 * Starlight drives Astro.currentLocale for docs, but file-based marketing
 * Site is English-only; marketing pages derive locale from Astro.currentLocale
 * when applicable.
 */

export type MarketingLocale = 'en' | 'fr';

export function getMarketingLocale(
  _pathname: string,
  _currentLocale?: string | undefined
): MarketingLocale {
  return 'en';
}

export function localePath(_locale: MarketingLocale, path = ''): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return clean === '' ? '/' : clean;
}
