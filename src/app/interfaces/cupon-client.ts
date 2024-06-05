export interface CuponClient {

  id?: number;
  idUser: number;
  empresa: string;
  nombre: string;
  ubicacion: string;
  categoria: string;
  precio: number;
  fecha_expira?: Date;
  pagoID: number;
  img: string;

}
