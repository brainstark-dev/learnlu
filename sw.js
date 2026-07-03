/* ============================================================
   LearnLu — Service Worker
   Enables: Offline mode · Fast loading · PWA installation
   ============================================================ */

const CACHE_NAME = 'learnlu-v1';
const OFFLINE_PAGE = '/offline.html';

/* Files to cache immediately when app is installed */
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/assets/css/style.css',
  '/assets/css/images.css',
  '/assets/css/mobile.css',
  '/assets/js/main.js',
  '/assets/js/theme-switcher.js',
  '/assets/js/app.js',
  '/pages/lessons.html',
  '/pages/lesson-hardware.html',
  '/pages/lesson-internet.html',
  '/pages/lesson-ram-storage.html',
  '/pages/lesson-cpu.html',
  '/pages/lesson-keyboard-mouse.html',
  '/pages/lesson-operating-system.html',
  '/pages/lesson-files-folders.html',
  '/pages/lesson-file-types.html',
  '/pages/lesson-passwords.html',
  '/pages/lesson-online-safety.html',
  '/pages/lesson-viruses.html',
  '/pages/lesson-email.html',
  '/pages/lesson-wifi-setup.html',
  '/pages/lesson-google-search.html',
  '/pages/lesson-copy-paste.html',
  '/pages/lesson-keyboard-shortcuts.html',
  '/pages/lesson-cloud-storage.html',
  '/pages/lesson-word-processing.html',
  '/pages/lesson-spreadsheets.html',
  '/pages/faq.html',
  '/pages/about.html',
  '/pages/privacy.html',
];

/* ---- Install: cache all core files ---- */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_URLS.map(url => new Request(url, { cache: 'reload' })))
        .catch(() => {
          /* If some files fail, still install - non-critical */
          return Promise.resolve();
        });
    }).then(() => self.skipWaiting())
  );
});

/* ---- Activate: clean old caches ---- */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

/* ---- Fetch: serve from cache, fall back to network ---- */
self.addEventListener('fetch', event => {
  /* Only handle GET requests */
  if (event.request.method !== 'GET') return;

  /* Skip cross-origin requests (fonts, Unsplash, etc.) */
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        /* Serve from cache, update in background */
        const networkFetch = fetch(event.request)
          .then(response => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
            }
            return response;
          })
          .catch(() => cached);
        return cached;
      }

      /* Not in cache — fetch from network */
      return fetch(event.request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          /* Offline — show offline page for navigation requests */
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_PAGE);
          }
          return new Response('Offline', { status: 503 });
        });
    })
  );
});

/* ---- Background sync for progress data ---- */
self.addEventListener('sync', event => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }
});

async function syncProgress() {
  /* When backend is added later, sync local progress to server */
  console.log('LearnLu: syncing progress...');
}
