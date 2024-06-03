import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CartItem } from 'src/app/interfaces/cart-item';
import { CuponService } from 'src/app/services/cupon/cupon.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  cupones: any[] = [];
  promociones: any[] = [];
  nameUser: string='';
  userID: string='';

  constructor(private router: Router, private service: CuponService,private alertController: AlertController) {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadUserData();
      }
    });
   }

   ngOnInit() {
    this.loadUserData();
    this.getAllCupon();


  }

  loadUserData() {
    const storedFirstName = localStorage.getItem('firstName');
    const userID= localStorage.getItem('userId');

    if (userID) {
      this.userID = JSON.parse(userID);
    }

    if (storedFirstName) {
      this.nameUser = JSON.parse(storedFirstName);
    }
  }
    logout() {

      localStorage.removeItem('firstName');
      localStorage.removeItem('usermail');
      localStorage.removeItem('userId');
      window.location.reload();


    }

    hasUser(): boolean {
      return !!this.nameUser; // Verifica si el usuario tiene algún valor
    }

  getAllCupon() {
    this.service.getAllCupon().subscribe(async (response: any) => {
      this.cupones = Array.isArray(response[0]) ? response[0] : [];
      this.promociones = Array.isArray(response[1]) ? response[1] : [];

      // Agregar promociones a los cupones correspondientes
      this.cupones.forEach(cupon => {
        cupon.promociones = this.promociones.filter(promo => promo.id_cupon === cupon.id);
      });

      console.log('Cupones:', this.cupones);
      console.log('Promociones:', this.promociones);
    });
  }


  getCuponImage(cupon: any): string {
    return cupon.urlImg ? cupon.urlImg : 'https://media.istockphoto.com/id/898233120/es/vector/plantilla-de-entrada-vector-de.jpg?s=612x612&w=0&k=20&c=usZ-4xHq3oG71fXexjsRxMC2-K_t2FO-zZtGgWsE4y8=';
  }
  /*-----------------------carrito */


  async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Carrito de Compras',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
  addToCart(cupon: any) {
    // Verificar si la cantidad es indefinida o menor a 1
    if (cupon.quantity === undefined || cupon.quantity < 1) {
      this.showAlert('La cantidad debe ser mayor a 1 y no puede estar vacía.');
      return;
    }

    // Obtener los elementos del carrito del localStorage o un array vacío si no hay ninguno
    let cartItems: any[] = JSON.parse(localStorage.getItem("cartItems" + this.userID) || "[]");

    // Buscar si el cupón ya está en el carrito
    const existingItem = cartItems.find(item => item.id === cupon.id);

    if (existingItem) {
      // Si el cupón ya está en el carrito, actualizar la cantidad
      existingItem.quantity = cupon.quantity;
    } else {
      // Si el cupón no está en el carrito, agregarlo con la cantidad
      cartItems.push({ id: cupon.id, quantity: cupon.quantity });
    }

    // Guardar el array actualizado en el localStorage
    localStorage.setItem("cartItems" + this.userID, JSON.stringify(cartItems));

    // Mostrar la alerta
    this.showAlert(`El cupón "${cupon.nombre}" se ha agregado al carrito con la cantidad de ${cupon.quantity}.`);
  }


/*------------------------------lista*/

currentPageIndex: number = 0; // Índice de la página actual
  itemsPerPage: number = 8; // Número de elementos por página

  getCuponesForCurrentPage(): any[] {
    const startIndex = this.currentPageIndex * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.cupones.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
    }
  }

  nextPage() {
    if (!this.isLastPage()) {
      this.currentPageIndex++;
    }
  }

  isLastPage(): boolean {
    const totalPages = Math.ceil(this.cupones.length / this.itemsPerPage);
    return this.currentPageIndex === totalPages - 1;
  }


}
