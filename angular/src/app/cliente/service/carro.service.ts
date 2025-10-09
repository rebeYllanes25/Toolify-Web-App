import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DetalleVenta } from '../../shared/model/detalleVenta.model';
import { Producto } from '../../shared/model/producto.model';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private items: DetalleVenta[] = [];

  private carrito$ = new BehaviorSubject<DetalleVenta[]>([]);

  getCarritoObservable() {
    return this.carrito$.asObservable();
  }

  agregarProducto(producto: Producto, cantidad: number): boolean {
    const detalle = this.items.find(
      (d) => d.producto.idProducto === producto.idProducto
    );
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
        subTotal: cantidad * producto.precio,
      });
    }
    this.carrito$.next([...this.items]);
    return true;
  }

  eliminarProducto(idProducto: number) {
    this.items = this.items.filter((d) => d.producto.idProducto !== idProducto);
    this.carrito$.next(this.items);
  }

  aumentarCantidad(idProducto: number) {
    const detalle = this.items.find(
      (d) => d.producto.idProducto === idProducto
    );
    if (detalle) {
      if (detalle.cantidad + 1 > detalle.producto.stock) {
        throw new Error(
          `Stock insuficiente. Stock máximo: ${detalle.producto.stock}`
        );
      }
      detalle.cantidad++;
      detalle.subTotal = detalle.cantidad * detalle.producto.precio;
      this.carrito$.next(this.items);
    }
  }

  disminuirCantidad(idProducto: number) {
    const detalle = this.items.find(
      (d) => d.producto.idProducto === idProducto
    );
    if (detalle) {
      detalle.cantidad--;
      if (detalle.cantidad <= 0) {
        this.eliminarProducto(idProducto);
      } else {
        detalle.subTotal = detalle.cantidad * detalle.producto.precio;
        this.carrito$.next(this.items);
      }
    }
  }

  limpiarCarrito() {
    this.items = [];
    this.carrito$.next(this.items);
  }

  getTotal() {
    return this.items.reduce((acc, item) => acc + item.subTotal, 0);
  }

  getItems() {
    return [...this.items];
  }
}
