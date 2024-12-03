import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

if (environment.production) {
  // Solo habilitar el Service Worker en producción
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registrado con éxito:', registration);
      })
      .catch(error => {
        console.error('Error al registrar el Service Worker:', error);
      });
  }
}

// Solicitar permiso de notificación
async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Permiso para notificaciones concedido');
    } else {
      console.log('Permiso para notificaciones denegado');
    }
  } catch (error) {
    console.error('Error al obtener permiso para notificaciones:', error);
  }
}

// Llama a la función para solicitar el permiso de notificaciones
requestNotificationPermission();


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));


