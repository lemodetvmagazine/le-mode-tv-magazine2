const CACHE = 'le-mode-tv-magazine-v3';

const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  './86E2A764-7B66-4070-8F44-7AC422100B93.png',
  './B937CFFC-B4EB-4FDC-A485-990E82BFCA8C.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll(FILES)
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE).map(key =>
          caches.delete(key)
        )
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then(cache =>
          cache.put(event.request, copy)
        );
      }
      return response;
    }).catch(() =>
      caches.match(event.request).then(
        cached => cached || caches.match('./index.html')
      )
    )
  );
});
