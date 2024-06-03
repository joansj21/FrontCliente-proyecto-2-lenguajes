import { Promocion } from "./promocion";

export interface Cupon {
  id: number;
  nombre: string;
  descripcion: string;
  fecha_inicio: Date;
  fecha_expira: Date;
  ubicacion: string;
  categoria: string;
  precio: number;
  promociones: Promocion[];
  cantidad: number;
}
