import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  email: string ="";
  password: string ="";
  firstName: string ="";
  lastName: string ="";
  dateOfBirth: string ="";

  confirmPassword: string ="";

  constructor(private router: Router,private userService:UserService,private alertController: AlertController) { }

  ngOnInit() {
    console.log("Register")
  }

  register() {
    if (this.password !== this.confirmPassword) {
      const mostrarAlertaError = async () => {
        const alert = await this.alertController.create({
          header: 'Respuesta del servidor',
          message: 'Contraseña no coinciden',
          buttons: ['OK']
        });
        await alert.present();
      };

      mostrarAlertaError();

      return;
    }

    this.registerUser();

  }

  async registerUser() {
    const newUser: User = {
      userId: 0, // Or remove this if the backend generates it
      firstName: this.firstName,
      lastName: this.lastName,
      dateOfBirth: new Date(this.dateOfBirth),
      email: this.email,
      password: this.password
    };

    this.userService.userRegister(newUser).subscribe(async (response: any) => {
      const alert = await this.alertController.create({
        header: 'Respuesta del servidor',
        message: "Registro " + response,
        buttons: ['OK']
      });
      await alert.present();

      this.router.navigate(['/menu']);
    }, async (error) => {
      const alert = await this.alertController.create({
        header: 'Error',
        message: "Error al registrar: " + error.message,
        buttons: ['OK']
      });
      await alert.present();
    });

  }



    goToLogin() {

      this.router.navigate(['/login']);
    }



}
