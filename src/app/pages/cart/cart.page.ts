import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Pago } from 'src/app/interfaces/pago';
import { CuponService } from 'src/app/services/cupon/cupon.service';
import { PagoService } from 'src/app/services/pago/pago.service';
import * as forge from 'node-forge'; // Importa el paquete 'node-forge' para utilizar RSA

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

  ModalPagar:boolean=false;


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

  rsaKeyPair: forge.pki.rsa.KeyPair;
  publicKey: string;
  privateKey: string;

  constructor(private router: Router, private service: CuponService,private servicePago:PagoService) {
    this.rsaKeyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
    this.publicKey = forge.pki.publicKeyToPem(this.rsaKeyPair.publicKey);
    this.privateKey = forge.pki.privateKeyToPem(this.rsaKeyPair.privateKey);

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

  onModalPago(){
    this.ModalPagar=true;
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


    const pago: Pago = this.createPaymentObject();

    pago.Tarjeta = this.encryptData(this.cardNumber);
    pago.ccv = this.encryptData(this.cvv);

    this.submitPayment(pago);
    //console.log("  pago cartItems" + this.userID)
    localStorage.removeItem("cartItems" + this.userID);




  } else {
    alert('Por favor, complete todos los campos de pago correctamente.'+this.errors);
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


/*realizar pago api -------------------------------------------------*/

createPaymentObject(): Pago {
  return {
    id:0,
    userId: parseInt(this.userID), // Asegúrate de convertir userID a un número si es de tipo string
    nameTarjeta: this.cardName,
    Tarjeta: this.cardNumber,
    ccv: this.cvv,
    price: this.calcularTotalConImpuesto(), // Usar el precio total con impuesto
    FechaVencimiento: this.expiryDate,
    PurchaseDate:new Date()

  };
}

// Método para enviar el pago al servicio
/*
submitPayment(pago: Pago) {
  this.servicePago.pagoRegister(pago).subscribe(
    (response) => {
      // Manejar la respuesta del servicio
      console.log('Pago realizado con éxito:', response);
      // Limpiar el carrito después de un pago exitoso
      localStorage.removeItem("cartItems" + this.userID);
    },
    (error) => {
      // Manejar errores
      console.error('Error al procesar el pago:', error);
    }
  );
}*/
submitPayment(pago: Pago) {
  this.servicePago.pagoRegister(pago).subscribe(
    (response: any) => {
      // Manejar la respuesta del servicio de pago
      console.log('Pago realizado con éxito:', response);

      // Registrar los cupones comprados con sus promociones
      this.registerCupons(response.id, response.userId);

      // Limpiar el carrito después de un pago exitoso
      localStorage.removeItem("cartItems" + this.userID);
    },
    (error) => {
      // Manejar errores
      console.error('Error al procesar el pago:', error);
    }
  );
}

registerCupons(pagoID: number, userID: number) {
  const cuponesComprados = this.obtenerCuponesComprados(pagoID,userID);

  cuponesComprados.forEach(cuponClient => {
    //cuponClient.cupon.pagoID = pagoID;
    //cuponClient.cupon.idUser = userID;

    // Verifica que todos los campos requeridos están presentes y no vacíos
   /* if (!cuponClient.cupon.nombre || !cuponClient.cupon.img) {
      console.error('Campos requeridos faltantes:', cuponClient.cupon);
      return;
    }*/

    // Log para debug
    console.log('Registrando cupón:', cuponClient);

    this.servicePago.cuponRegister(cuponClient).subscribe(
      (cuponResponse) => {
        console.log('Cupón registrado con éxito:', cuponResponse);
      },
      (cuponError) => {
        console.error('Error al registrar el cupón:', cuponError);
      }
    );
  });
}
obtenerCuponesComprados(pagoID: number, userID: number) {
  console.log("Lista de cupones", this.cupones);
  return this.cupones.flatMap(cuponArray =>
    cuponArray.map((cupon: { id: any; nombre_empresa: any; nombre: any; ubicacion: any; categoria: any; precio: any; fecha_expira: any; urlImg: any; }) => ({
      cupon: {
        id: cupon.id,
        empresa: cupon.nombre_empresa,
        nombre: cupon.nombre,
        ubicacion: cupon.ubicacion,
        categoria: cupon.categoria,
        precio: cupon.precio.toString(),
        fechaExpira: new Date(cupon.fecha_expira).toISOString(),
        pagoID: pagoID, // Se asignará en registerCupons
        img: cupon.urlImg?cupon.urlImg:"",
        idUser: userID // Se asignará en registerCupons
      },
      promociones: this.promociones.filter(promocion => promocion.id_cupon === cupon.id)

      .map((promocion: any) => ({
        id: 0,
        nombre: promocion.descripcion+" Finaliza:"+promocion.fecha_expira,
        cuponID: promocion.id_cupon
      }))

    }))
  );
}

/*obtenerCuponesComprados() {

    console.log("lista cupones"+this.cupones)
  return this.cupones.forEach(cuponArray=> {

        this.cuponArray.map(cupon =>{

          return {
            cupon: {
              id: cupon.id,
              empresa: cupon.nombre_empresa,
              nombre: cupon.nombre,
              ubicacion: cupon.ubicacion,
              categoria: cupon.categoria,
              precio: cupon.precio,
              fechaExpira: cupon.fecha_expira,
              pagoID: 0, // Se asignará en registerCupons
              img: cupon.urlImg,
              idUser: 0 // Se asignará en registerCupons
            },
            promociones: this.promociones.filter(promocion => promocion.cupon_id === cuponArray.id)
          };
        });
  });
}
*/


//-----------------------------encripta
// Genera un par de claves RSA (pública y privada)

encryptData(data: string): string {
  const publicKeyObj = forge.pki.publicKeyFromPem(this.publicKey);

  // Convierte la cadena de datos a bytes
  const dataBytes = forge.util.encodeUtf8(data);

  // Cifra los datos utilizando la clave pública RSA
  const encrypted = publicKeyObj.encrypt(dataBytes);

  // Devuelve los datos cifrados en formato Base64
  return forge.util.encode64(encrypted);
}




/**-------------------------- */




}
