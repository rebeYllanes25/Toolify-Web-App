export interface CategoriaVentasDTO {
  idCategoria: number;
  descripcionCategoria: string;
  cantidadVendida: number;
  cantidadProductos: number;
}

export interface IndexResponse {
  categories: CategoriaVentasDTO[];
  totalClientes: number;
  totalProductos: number;
}