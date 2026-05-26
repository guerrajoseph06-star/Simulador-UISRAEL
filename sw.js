// Service Worker - Simulador UISRAEL v7
// Cachea todo el contenido para funcionar 100% sin internet

const CACHE_NAME = 'uisrael-v7';
const ARCHIVOS_A_CACHEAR = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// INSTALAR: cachear todos los archivos
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando y cacheando archivos...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ARCHIVOS_A_CACHEAR);
    }).then(() => {
      console.log('[SW] Archivos cacheados. App lista para usar offline.');
      return self.skipWaiting();
    })
  );
});

// ACTIVAR: limpiar caches viejos
self.addEventListener('activate', (event) => {
  console.log('[SW] Activando nueva versión...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Borrando cache viejo:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// FETCH: siempre servir desde cache (offline-first)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si está en cache, servir desde ahí (sin internet)
      if (cachedResponse) {
        return cachedResponse;
      }
      // Si no está en cache, intentar la red
      return fetch(event.request).then((networkResponse) => {
        // Cachear la respuesta nueva para la próxima vez
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Sin internet y sin cache: mostrar mensaje
        console.log('[SW] Sin internet y sin cache para:', event.request.url);
      });
    })
  );
});
