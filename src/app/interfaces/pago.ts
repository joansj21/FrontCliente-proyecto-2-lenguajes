export interface Pago {
  id:number,
  userId: number;
  nameTarjeta: string;
  Tarjeta: string;
  ccv: string;
  price: number;
  FechaVencimiento: string;
  PurchaseDate:Date;
}
