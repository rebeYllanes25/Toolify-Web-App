import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../../shared/model/producto.model';
import { ProductoPorCategoriaDTO } from '../../shared/dto/productoPorCategoriaDTO.model';
import { ProductoPorProveedor } from '../../shared/dto/productoPorProveedor.model';

//ENTORNO DE CONFIGURACION CON DOCKER
import { environment } from '@envs/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductoServiceService {
  private url = `${environment.api_URL}/producto`;
  constructor(private http: HttpClient) {}

  listarProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.url}/index`);
  }

  createProducto(producto: Producto, imagenFile: File | null): Observable<any> {
     const formData = new FormData();
    
    formData.append('nombre', producto.nombre);
    formData.append('descripcion', producto.descripcion);
    formData.append('precio', producto.precio.toString());
    formData.append('stock', producto.stock.toString());
    formData.append('proveedor.idProveedor', producto.proveedor.idProveedor!!.toString());
    formData.append('categoria.idCategoria', producto.categoria.idCategoria.toString());
    
    if (imagenFile) {
      formData.append('imagenUrl', imagenFile);
    }
    
    return this.http.post<Producto>(`${this.url}/registrar`, formData);
  }

  detalleProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}/obtenerId/${id}`);
  }

  actualizarProducto(id: number, producto: Producto, imagenFile: File | null): Observable<Producto> {
    const formData = new FormData();
    
    formData.append('nombre', producto.nombre);
    formData.append('descripcion', producto.descripcion);
    formData.append('precio', producto.precio.toString());
    formData.append('stock', producto.stock.toString());
    formData.append('proveedor.idProveedor', producto.proveedor.idProveedor!!.toString());
    formData.append('categoria.idCategoria', producto.categoria.idCategoria.toString());
    
    if (imagenFile) {
      formData.append('imagenUrl', imagenFile);
    }
    
    return this.http.put<Producto>(`${this.url}/actualizar/${id}`, formData);
  }

  desactivarProducto(id: number): Observable<string> {
    return this.http.put(
      `${this.url}/desactivar/${id}`,
      {},
      { responseType: 'text' }
    ) as Observable<string>;
  }

  listarProductoPorCategoria(
    idCategoria: number,
    orden: string = 'ASC'
  ): Observable<Producto[]> {
    let urlBase = `${this.url}/listaCategorias`;
    if (idCategoria != null && idCategoria > 0) {
      urlBase += `/${idCategoria}`;
    }
    urlBase += `?orden=${orden}`;
    return this.http.get<Producto[]>(urlBase);
  }

  //para el grafico
  listadoDeProductoPorCategoria(): Observable<ProductoPorCategoriaDTO[]> {
    return this.http.get<ProductoPorCategoriaDTO[]>(
      `${this.url}/listadoProductoCategoria`
    );
  }

  listadoDeProductoPorProveedor(): Observable<ProductoPorProveedor[]> {
    return this.http.get<ProductoPorProveedor[]>(
      `${this.url}/listadoProductoProveedor`
    );
  }

  /*  listadoDeVentasPorMes():Observable<VentaPorFechasDTO[]>{
    return this.http.get<VentaPorFechasDTO[]>(`${this.url}/ListaMes`)
  }*/
}
