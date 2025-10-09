import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DetalleVenta } from '../../shared/model/detalleVenta.model';
import { Producto } from '../../shared/model/producto.model';
import { Venta } from '../../shared/model/venta.model';
import { ResultadoResponse } from '../../shared/dto/resultadoResponse.model';
import { VentaDTO } from '../../shared/dto/ventaDTO.model';
import { Categoria } from '../../shared/model/categoria.model';

//ENTORNO DE CONFIGURACION CON DOCKER
import {environment} from '@envs/environment'

@Injectable({
  providedIn: 'root'
})
export class CarroService {

  private baseUrl = `${environment.api_URL}/vendedor`;

  private items: DetalleVenta[] = [];
  private carrito$ = new BehaviorSubject<DetalleVenta[]>([]);

  constructor(private http: HttpClient) { }

  getCarritoObservable() {
    return this.carrito$.asObservable();
  }

  agregarProducto(producto: Producto, cantidad: number): boolean {
    const detalle = this.items.find(d => d.producto.idProducto === producto.idProducto);

    if (detalle) {
      const nuevaCantidad = detalle.cantidad + cantidad;
      if (nuevaCantidad > producto.stock) {
        return false;
      }
      detalle.cantidad = nuevaCantidad;
      detalle.subTotal = detalle.cantidad * producto.precio;
    } else {
      if (cantidad > producto.stock) {
        return false;
      }
      this.items.push({
        producto,
        cantidad,
        subTotal: cantidad * producto.precio
      });
    }

    this.carrito$.next([...this.items]);
    return true;
  }

  eliminarProducto(idProducto: number) {
    this.items = this.items.filter(d => d.producto.idProducto !== idProducto);
    this.carrito$.next([...this.items]);
  }

  aumentarCantidad(idProducto: number) {
    const detalle = this.items.find(d => d.producto.idProducto === idProducto);
    if (detalle) {
      if (detalle.cantidad + 1 > detalle.producto.stock) {
        throw new Error(`Stock insuficiente. Máx: ${detalle.producto.stock}`);
      }
      detalle.cantidad++;
      detalle.subTotal = detalle.cantidad * detalle.producto.precio;
      this.carrito$.next([...this.items]);
    }
  }

  disminuirCantidad(idProducto: number) {
    const detalle = this.items.find(d => d.producto.idProducto === idProducto);
    if (detalle) {
      detalle.cantidad--;
      if (detalle.cantidad <= 0) {
        this.eliminarProducto(idProducto);
      } else {
        detalle.subTotal = detalle.cantidad * detalle.producto.precio;
        this.carrito$.next([...this.items]);
      }
    }
  }

  limpiarCarrito() {
    this.items = [];
    this.carrito$.next([...this.items]);
  }

  getTotal() {
    return this.items.reduce((acc, item) => acc + item.subTotal, 0);
  }

  getItems() {
    return [...this.items];
  }

  setItems(nuevosItems: DetalleVenta[]) {
    this.items = [...nuevosItems];
  }

  //API
  /*
  listarProductosActivos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/productos`);
  }
  */

  listarProductosActivos(idCategoria?: number): Observable<Producto[]> {
    let url = `${this.baseUrl}/productos`;
    if (idCategoria != null) {
      url += `?idCategoria=${idCategoria}`;
    }
    return this.http.get<Producto[]>(url);
  }

  finalizarVenta(venta: Venta): Observable<ResultadoResponse> {
    venta.total = this.getTotal();
    venta.detalles = this.getItems();

    return this.http.post<ResultadoResponse>(`${this.baseUrl}/grilla`, venta);
  }

  listarVentasVendedor(idUsuario: number): Observable<VentaDTO[]> {
    return this.http.get<VentaDTO[]>(`${this.baseUrl}/perfil?idUsuario=${idUsuario}`);
  }
}
