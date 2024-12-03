import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';;
  password: string = '';

  constructor(
    private afAuth : AngularFireAuth,
    private router : Router,
    private alertController : AlertController
  ) { }

  ngOnInit() {
  }

  async iniciar(){
    try {
      // Intentar iniciar sesión
      await this.afAuth.signInWithEmailAndPassword(this.email, this.password);

      // Enviar notificación local
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1,
            title: 'Inicio de sesión exitoso',
            body: `¡Bienvenido/a, ${this.email}!`,
            schedule: { at: new Date(Date.now() + 1000) }, // 1 segundo después
          },
        ],
      });

      // Redirigir al usuario a la página principal
      this.router.navigate(['/index']);
    } catch (error) {
      console.log(error);

      // Mostrar alerta si ocurre un error
      const alert = await this.alertController.create({
        header: 'Error',
        message:
          'El usuario no existe, o la contraseña es incorrecta, intenta de nuevo',
        buttons: ['Ok'],
        
      });
      await alert.present();
      return;
    }
  }
  




}
