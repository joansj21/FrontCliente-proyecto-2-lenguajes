import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CuponService } from 'src/app/services/cupon/cupon.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  cupones: any[] = [];
  promociones: any[] = [];
  nameUser: string='';
  userID: string='';
  totalPagar:number=0;


  cardName: string = '';
  cardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';

  errors: any = {
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  };

  constructor(private router: Router, private service: CuponService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.cupones=[];
        this.loadUserData();
        this. getCarritoCupon();
      }
    });
  }

  ngOnInit() {

   // this.loadUserData();
    //this.getCarritoCupon();
    console.log("cart page")

     //localStorage.removeItem("cartItems" + this.userID);
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

  getCarritoCupon() {
    // Obtener los elementos del carrito del almacenamiento local
    const cartItemsString: string | null = localStorage.getItem("cartItems" + this.userID);

    // Verificar si hay elementos en el carrito
    if (cartItemsString) {
      // Convertir la cadena JSON a un arreglo
      const cartItems: any[] = JSON.parse(cartItemsString) || [];
      console.log(cartItems)

      // Iterar sobre los elementos del carrito y llamar al servicio para obtener los detalles de cada cupón
      cartItems.forEach(cartItem => {
        const cartItemIdNumber: number = parseInt(cartItem.id, 10); // Usa parseInt con base 10 para asegurar la conversión correcta

        this.service.getCarritoCupon(cartItemIdNumber).subscribe((response: any) => {
          // Verificar si la respuesta tiene elementos válidos
          if (Array.isArray(response) && response.length > 0) {
            // Obtener el cupón y la promoción de la respuesta
            const cupon = response[0];
            cupon.quantity = cartItem.quantity; // Asignar la cantidad del carrito al cupón
            cupon.id = cartItem.id; // Asignar la cantidad del carrito al cupón
            const promocion = response[1][0]; // Supongo que solo hay una promoción por cada cupón

            // Agregar el cupón y la promoción a los arreglos correspondientes
            this.cupones.push(cupon);
            this.promociones.push(promocion);

            console.log("cupone "+cupon.id)
          }
        });
      });
    } else {
      // El carrito está vacío en el almacenamiento local
      console.log('El carrito está vacío en el almacenamiento local.');
    }
  }



  getCuponImage(cupon: any): string {
    return cupon.urlImg ? cupon.urlImg : 'https://media.istockphoto.com/id/898233120/es/vector/plantilla-de-entrada-vector-de.jpg?s=612x612&w=0&k=20&c=usZ-4xHq3oG71fXexjsRxMC2-K_t2FO-zZtGgWsE4y8=';
  }

  chunk(array: any[], size: number) {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
  }
  /*//////////////pago */

  calcularTotalSinImpuesto(): number {
    let total = 0;
    this.cupones.forEach(cuponArray => {
      cuponArray.forEach((cupon: { precio: number; cantidad: number; }) => {
        total += cupon.precio * cuponArray.quantity;
      });
    });

    this.totalPagar=parseFloat(total.toFixed(2));;
    return parseFloat(total.toFixed(2));
  }

  calcularTotalConImpuesto(): number {
    const totalSinImpuesto = this.calcularTotalSinImpuesto();
    const totalConImpuesto = totalSinImpuesto * 1.13;
    return parseFloat(totalConImpuesto.toFixed(2));
  }

/*----------------- modal pago*/
proceedToPayment() {
  this.validateCardName();
  this.validateCardNumber();
  this.validateExpiryDate();
  this.validateCVV();

  if (!this.errors.cardName && !this.errors.cardNumber && !this.errors.expiryDate && !this.errors.cvv) {
    // Simular el procesamiento del pago
    console.log('Detalles de la tarjeta:', {
      cardName: this.cardName,
      cardNumber: this.cardNumber,
      expiryDate: this.expiryDate,
      cvv: this.cvv
    });

    // Mostrar un mensaje de éxito
    alert('Pago realizado con éxito.');
    //console.log("  pago cartItems" + this.userID)
    localStorage.removeItem("cartItems" + this.userID);




  } else {
    alert('Por favor, complete todos los campos de pago correctamente.');
  }
}







/*validaciones-------------------------------- */
validateCardName() {
  if (!this.cardName) {
    this.errors.cardName = 'El nombre en la tarjeta es requerido.';
  } else {
    this.errors.cardName = '';
  }
}

validateCardNumber() {
  const regex = /^\d{16}$/;
  if (!this.cardNumber) {
    this.errors.cardNumber = 'El número de tarjeta es requerido.';
  } else if (!regex.test(this.cardNumber)) {
    this.errors.cardNumber = 'El número de tarjeta debe tener 16 dígitos.';
  } else if (!this.isValidCardNumber(this.cardNumber)) {
    this.errors.cardNumber = 'El número de tarjeta no es válido.';
  } else {
    this.errors.cardNumber = '';
  }
}

isValidCardNumber(cardNumber: string): boolean {
  let sum = 0;
  let shouldDouble = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}
validateExpiryDate() {
  const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!this.expiryDate) {
    this.errors.expiryDate = 'La fecha de expiración es requerida.';
  } else if (!regex.test(this.expiryDate)) {
    this.errors.expiryDate = 'La fecha de expiración debe estar en el formato MM/YY.';
  } else {
    const [month, year] = this.expiryDate.split('/');
    const expiry = new Date(`20${year}-${month}-01`);
    const now = new Date();
    if (expiry < now) {
      this.errors.expiryDate = 'La tarjeta ha expirado.';
    } else {
      this.errors.expiryDate = '';
    }
  }
}

validateCVV() {
  const regex = /^\d{3}$/;
  if (!this.cvv) {
    this.errors.cvv = 'El CVV es requerido.';
  } else if (!regex.test(this.cvv)) {
    this.errors.cvv = 'El CVV debe tener 3 dígitos.';
  } else {
    this.errors.cvv = '';
  }
}





}
