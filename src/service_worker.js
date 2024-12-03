const CACHE_NAME = 'cache-perron';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/details.html',
  '/styles.css',
  '/app.js',
  '/icon.png'
];

// Instalar el Service Worker y cachear los recursos estáticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// Activar el Service Worker y limpiar el caché antiguo
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
});
// Interceptar las solicitudes de red y servir desde el caché
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/details')) {
    // Manejar específicamente la página details
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse; // Devuelve la página en caché si existe
        }
        return fetch(event.request).catch(() => {
          // Devuelve una estructura básica si no hay conexión
          return new Response(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Detalles Offline</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  margin: 0;
                  background-color: #f8f9fa;
                  color: #333;
                }
                h1 {
                  color: #b00020;
                }
              </style>
            </head>
            <body>
              <h1>Detalles no disponibles</h1>
              <p>Actualmente no tienes conexión a Internet.</p>
            </body>
            </html>
          `, {
            headers: { 'Content-Type': 'text/html' }
          });
        });
      })
    );
  } else {
    // Lógica predeterminada para otras solicitudes
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => cachedResponse || fetch(event.request).then(response => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
            return response;
          });
        }))
    );
  }
});

  
  // Manejar notificaciones push
  self.addEventListener('push', event => {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon,
      actions: data.actions
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
// Manejar clics en notificaciones
self.addEventListener('notificationclick', event => {
    event.notification.close();
    if (event.action === 'accion1') {
      clients.openWindow('/ruta1');
    } else if (event.action === 'accion2') {
      clients.openWindow('/ruta2');
    } else {
      clients.openWindow('/');
  }
});  