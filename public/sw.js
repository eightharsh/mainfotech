/* MA Infotech — service worker (conservative caching for PWA installability + offline).
   Bump CACHE_VERSION to force clients to refresh cached assets. */
const CACHE_VERSION = 'v1';
const CACHE_NAME = `mainfotech-${CACHE_VERSION}`;

const OFFLINE_HTML = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Offline — MA Infotech</title>
<style>body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
background:#f8f9fa;color:#0f172a;display:grid;place-items:center;min-height:100dvh;text-align:center;padding:24px}
.c{max-width:22rem}h1{font-size:1.4rem;margin:.5rem 0}p{color:#374151;line-height:1.6}
a{display:inline-block;margin-top:1rem;background:#2563eb;color:#fff;text-decoration:none;
padding:.7rem 1.4rem;border-radius:9999px;font-weight:600}</style></head>
<body><div class="c"><h1>You're offline</h1>
<p>Please check your internet connection and try again. You can still call us on
<strong>+91 70212 09087</strong>.</p>
<a href="/">Retry</a></div></body></html>`;

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.put(
        '/offline',
        new Response(OFFLINE_HTML, {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        })
      )
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests. Never touch the API or other methods.
  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  // Page navigations: network-first, fall back to cache, then offline page.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then(cached => cached || caches.match('/offline'))
        )
    );
    return;
  }

  // Static assets: stale-while-revalidate.
  if (
    url.pathname.startsWith('/_astro/') ||
    /\.(?:css|js|woff2?|png|jpe?g|webp|svg|ico|gif)$/.test(url.pathname)
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(request).then(cached => {
          const network = fetch(request)
            .then(response => {
              if (response && response.status === 200) {
                cache.put(request, response.clone());
              }
              return response;
            })
            .catch(() => cached);
          return cached || network;
        })
      )
    );
  }
});
