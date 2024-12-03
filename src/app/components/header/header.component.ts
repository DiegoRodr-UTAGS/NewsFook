import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/compat/auth";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

  constructor(
    private router:Router,
    private afAuth: AngularFireAuth
  ) { }

  logout(){
   this.afAuth.signOut()
   .then(() => {
    console.log('Sesión cerrada');
    this.router.navigate(['/login']);
   })
   .catch(error => console.error('Error al cerrar sesíon', error));
  }

}
