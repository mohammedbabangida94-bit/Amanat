self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('amanat-v1').then((cache) => {
      return cache.addAll([
  './',
  './index.html', 
   
  './app.js', 
  './siren.mp3', 
  './icon.png'
]);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});