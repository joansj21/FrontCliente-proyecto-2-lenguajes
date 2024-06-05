import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string ="";
  password: string  ="";


  constructor(private router: Router,private userService:UserService,private alertController: AlertController) { }


  ngOnInit(): void {
   console.log("")
  }



  login() {
    this.userService.UserLogin(this.email, this.password).subscribe(async (response: User) => {
        // Verificar si la respuesta tiene un código de estado 404

          // Usuario encontrado, procesa la respuesta
          console.log('Usuario encontrado:', response);

          console.log("datos enviados",response)
          const alert = await this.alertController.create({
            header: 'Respuesta del servidor',
            message: "Login exitoso",
            buttons: ['OK']
          });
          await alert.present();

          localStorage.setItem('userId', JSON.stringify(response.userId));
          localStorage.setItem('firstName', JSON.stringify(response.firstName));
          localStorage.setItem('usermail', JSON.stringify(response.email));
          localStorage.setItem('loginInit',"login");


         // this.router.navigate(['/concert']);
        // this.router.navigate(['/menu']);
        this.router.navigateByUrl('/menu');



      },
      (error) => {
        // Manejar errores de la solicitud
        console.log('Usuario No encontrado:');

        // Utilizar una función asíncrona para poder usar await
        const mostrarAlertaError = async () => {
          const alert = await this.alertController.create({
            header: 'Respuesta del servidor',
            message: 'Login Falló',
            buttons: ['OK']
          });
          await alert.present();
        };

        mostrarAlertaError();
      }


    );
  }


  goToRegister() {
    alert("registrar")
    this.router.navigate(['/register']);
  }
}
