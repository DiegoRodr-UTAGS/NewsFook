import { Component } from '@angular/core';
import { LocalNotifications } from "@capacitor/local-notifications";
import { Router } from "@angular/router";
import { Platform } from "@ionic/angular";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private router: Router,
    private platform: Platform
  ){
    this.initializeNotifications();
  }

  async initializeNotifications() {
    // Solicitar permisos para las notificaciones
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display === 'granted') {
      console.log('Permisos de notificaciones concedidos');
    }

    // Escuchar las acciones de botones en notificaciones
    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      const actionId = notification.actionId;
      const extra = notification.notification?.extra;

      if (actionId === 'view') {
        // Lógica para "Ver perfil"
        console.log('Acción: Ver perfil');
        this.router.navigate(['/profile']);
      } else if (actionId === 'logout') {
        // Lógica para "Cerrar sesión"
        console.log('Acción: Cerrar sesión');
        this.router.navigate(['/login']);
      }
    });
  }
  

  CambioTema(){
    this.platform.ready().then(() => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if(prefersDark) {
        document.body.classList.add('dark');
      }
      else{
        document.body.classList.remove('dark');
      }
    });
  }
}
