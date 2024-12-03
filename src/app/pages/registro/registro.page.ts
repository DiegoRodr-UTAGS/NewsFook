import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Routes, RouterModule, Router } from "@angular/router";
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  email: string = '';
  password: string = '';
  conPassword: string = '';


  constructor(
    private afAuth: AngularFireAuth, 
    private router: Router, 
    private alertController : AlertController
  ) {}

  ngOnInit() {
  }



  async register(){

    if (this.password === this.conPassword){
      try {
        await this.afAuth.createUserWithEmailAndPassword(this.email, this.password);
        this.router.navigate(['/index']);
      }
      catch(error) {
        console.log(error);
      }
    }
    else{
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Las contraseñas no coinciden, verifica y vueleve a intentar',
        buttons : ['OK']
      });
      await alert.present();
      return;
    }
  }
  

}
