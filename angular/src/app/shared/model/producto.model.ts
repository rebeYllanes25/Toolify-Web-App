import { Categoria } from "./categoria.model";
import { Proveedor } from "./proveedor.model";

export interface Producto {
  idProducto?: number;
  nombre: string;
  descripcion: string;
  proveedor: Proveedor;
  categoria: Categoria;
  precio: number;
  stock: number;
  imagen?: string;

  fechaRegistro?: string;
  estado: boolean;
}