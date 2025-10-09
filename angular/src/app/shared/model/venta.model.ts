import { DetalleVenta } from "./detalleVenta.model";
import { Usuario } from "./usuario.model";

export interface Venta {
  idVenta: number;
  usuario: Usuario;       // o un objeto Usuario si quieres
  total: number;
  detalles: DetalleVenta[];
  tipoVenta?: 'P' | 'R'; 
  fecha?: string;
  estado?: string;
}