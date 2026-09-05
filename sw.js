/**
 * CELEBRATION — High Performance Service Worker
 * Version: 2.0.0
 * Provides offline support, caching strategies, and instant load for iOS and Android
 */

const CACHE_NAME = 'celebration-v2.0.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './concierge-ai.css',
  './script.js',
  './concierge-ai.js',
  './concierge-db.js',
  './manifest.webmanifest',
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-512x512.png',
  './assets/icons/icon-maskable-512x512.png',
  './assets/icons/apple-touch-icon-180x180.png',
  './assets/icons/favicon-64x64.png',
  './assets/images/hero_editorial_couple.jpg',
  './assets/images/og_share_cover.jpg',
  './assets/images/mobile_couple_story.jpg',
  './assets/images/reception_party_couple.jpg',
  './assets/images/web_mockup_showcase.jpg',
  './assets/images/founder_concierge_portrait.jpg',
  './assets/images/estilo_romantico.jpg',
  './assets/images/estilo_clasico.jpg',
  './assets/images/estilo_editorial.jpg'
];

// Install: Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn('[SW] Pre-caching partial error:', err))
  );
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Removing old cache version:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Strategy depending on request type
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests
  if (request.method !== 'GET') return;

  // 1. Navigation requests (HTML pages): Network first, fallback to cached HTML
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          const fallback = await caches.match('./index.html');
          return fallback || Response.error();
        })
    );
    return;
  }

  // 2. Google Fonts & CDN resources: Stale-While-Revalidate
  if (url.origin.includes('fonts.googleapis.com') || url.origin.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => null);
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 3. Static local assets (CSS, JS, Images, Icons): Cache First with Background Update
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Background revalidation
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
          }
        }).catch(() => {/* Offline, silent fallback */});

        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
        return networkResponse;
      }).catch(() => {
        // Fallback for missing offline image
        if (request.destination === 'image') {
          return caches.match('./assets/icons/icon-192x192.png');
        }
      });
    })
  );
});
