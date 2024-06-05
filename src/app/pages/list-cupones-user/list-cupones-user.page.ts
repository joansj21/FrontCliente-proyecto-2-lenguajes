import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CuponClientService } from 'src/app/services/cuponClient/cupon-client.service';

@Component({
  selector: 'app-list-cupones-user',
  templateUrl: './list-cupones-user.page.html',
  styleUrls: ['./list-cupones-user.page.scss'],
})
export class ListCuponesUserPage implements OnInit {

  cupones: any[] = [];
  userID: string = '';
  nameUser: string = '';

  constructor( private router: Router,private service:CuponClientService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadUserData();

        if (!this.userID) {
          this.router.navigateByUrl('/menu');
        }

      }
    });

   }



  ngOnInit(): void {
    this.loadUserData();
    this.getCupones();
  }


  loadUserData() {
    const storedFirstName = localStorage.getItem('firstName');
    const userID = localStorage.getItem('userId');

    if (userID) {
      this.userID = JSON.parse(userID);
    }

    if (storedFirstName) {
      this.nameUser = JSON.parse(storedFirstName);
    }
  }


  getCupones(){

    this.service.cuponListUser(parseInt(this.userID)).subscribe(
      (response) => {
        this.cupones = response;

        console.log(response)

      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );


  }

  getCuponImage(cupon: any): string {


    return cupon.img ? cupon.img : 'https://media.istockphoto.com/id/898233120/es/vector/plantilla-de-entrada-vector-de.jpg?s=612x612&w=0&k=20&c=usZ-4xHq3oG71fXexjsRxMC2-K_t2FO-zZtGgWsE4y8=';
  }


  hasExpired(expirationDate: string): boolean {
    const now = new Date();
    const expiration = new Date(expirationDate);
    return now > expiration;
  }

  logout() {
    localStorage.removeItem('firstName');
    localStorage.removeItem('usermail');
    localStorage.removeItem('userId');
    this.router.navigateByUrl('/menu');
  }

  hasUser(): boolean {
    return !!this.nameUser; // Verifica si el usuario tiene algún valor
  }




}
