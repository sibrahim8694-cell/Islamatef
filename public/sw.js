// Basic service worker to suppress the "No matching service worker detected" warning and allow PWA installability

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // Doing nothing, just pass through network
});
