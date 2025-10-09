import { Producto } from "./producto.model";

export interface DetalleVenta {
  idDetalleVenta?: number; 
  venta?: any;           
  producto: Producto;
  cantidad: number;
  subTotal: number;
}