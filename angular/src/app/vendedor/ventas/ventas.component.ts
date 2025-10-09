import { Component, OnInit } from '@angular/core';
import { CarroService } from '../service/carro.service';
import { Venta } from '../../shared/model/venta.model';
import { Producto } from '../../shared/model/producto.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetalleVenta } from '../../shared/model/detalleVenta.model';
import { Usuario } from '../../shared/model/usuario.model';
import { Categoria } from '../../shared/model/categoria.model';


@Component({
  selector: 'app-ventas',
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent implements OnInit {

  productos: Producto[] = [];
  productosSeleccionados: DetalleVenta[] = [];
  categorias: Categoria[] = [];
  categoriaSeleccionada?: number;
  carrito: DetalleVenta[] = [];
  textoBusqueda: string = '';
  productosFiltrados: Producto[] = [];
  alertas: { mensaje: string, tipo: string }[] = [];


  usuarioPrecargado: Usuario = {
    idUsuario: 3,
    nombres: 'Juan',
    apeMaterno: 'Meza',
    apePaterno: 'Gonzales',
    correo: 'juan.gonzales@example.com',
    clave: 'clave123',
    nroDocumento: '34567890',
    direccion: 'Jr. Perú 789',
    distrito: { idDistrito: 3, nombre: 'El Agustino' },
    telefono: '987654323',
    rol: { idRol: 3, descripcion: 'Vendedor' },
    fechaRegistro: new Date().toISOString(),
    estado: true
  };

  venta: Venta = {
    idVenta: 0,
    usuario: this.usuarioPrecargado,
    total: 0,
    detalles: []
  };

  constructor(private carroService: CarroService) { }

  ngOnInit(): void {
    this.cargarProductosPorCategoria();
  }


  cargarProductosPorCategoria(idCategoria?: number) {
    this.carroService.listarProductosActivos(idCategoria).subscribe({
      next: data => this.productos = data,
      error: err => {
        console.error('Error cargando productos', err);
        this.mostrarAlerta('No se encontraron productos en esta categoría', 'warning');
      }
    });
  }

  filtrarProductos() {
  const texto = this.textoBusqueda.toLowerCase();
  this.productosFiltrados = this.productos.filter(p =>
    (!this.categoriaSeleccionada || p.categoria.idCategoria === this.categoriaSeleccionada) &&
    (p.nombre.toLowerCase().includes(texto) ||
     p.categoria.descripcion.toLowerCase().includes(texto) ||
     p.precio.toString().includes(texto) ||
     p.stock.toString().includes(texto) ||
     `PROD${p.idProducto}`.includes(texto))
  );
}

  agregarSeleccionado(producto: Producto) {
    const existente = this.productosSeleccionados.find(d => d.producto.idProducto === producto.idProducto);

    if (existente) {
      existente.cantidad++;
      existente.subTotal = existente.cantidad * existente.producto.precio;
    } else {
      this.productosSeleccionados.push({
        producto,
        cantidad: 1,
        subTotal: producto.precio
      });
    }
  }

  eliminarSeleccionado(codigo: number) {
    this.productosSeleccionados = this.productosSeleccionados.filter(
      d => d.producto.idProducto !== codigo
    );
  }

  eliminarItemDeVenta(codigo: number) {
    this.carrito = this.carrito.filter(d => d.producto.idProducto !== codigo);
    this.carroService.setItems(this.carrito);
  }


  aumentarCantidad(item: DetalleVenta) {
    if (item.cantidad < item.producto.stock) {
      item.cantidad++;
      item.subTotal = item.cantidad * item.producto.precio;
    } else {
      this.mostrarAlerta('Stock insuficiente', 'warning');
    }
  }

  disminuirCantidad(item: DetalleVenta) {
    if (item.cantidad > 1) {
      item.cantidad--;
      item.subTotal = item.cantidad * item.producto.precio;
    } else {
      this.productosSeleccionados = this.productosSeleccionados.filter(
        d => d.producto.idProducto !== item.producto.idProducto
      );
    }
  }

  pasarAlCarrito() {
    this.productosSeleccionados.forEach(p => this.carroService.agregarProducto(p.producto, p.cantidad));
    this.productosSeleccionados = [];
    this.carrito = this.carroService.getItems();
  }


  calcularTotalCarrito(): number {
    return this.carrito.reduce((acc, d) => acc + d.subTotal, 0);
  }

  finalizarVenta() {
    if (this.carroService.getItems().length === 0) {
      this.mostrarAlerta('El carrito está vacío', 'warning');
      return;
    }

    const venta: Venta = {
      idVenta: 0,
      usuario: this.usuarioPrecargado,
      detalles: this.carroService.getItems(),
      total: this.carroService.getTotal()
    };

    console.log('Venta que se envía:', venta);

    this.carroService.finalizarVenta(venta).subscribe({
      next: resp => {
        console.log('Venta finalizada', resp);
        this.mostrarAlerta('Venta realizada con éxito', 'success');
        this.carroService.limpiarCarrito();
        this.carrito = [];
      },
      error: err => {
        console.error('Error en la venta', err);
        this.mostrarAlerta('Error al finalizar venta', 'danger');
      }
    });
  }

  mostrarAlerta(mensaje: string, tipo: string = 'success') {
    const alerta = { mensaje, tipo };
    this.alertas.push(alerta);
    setTimeout(() => {
      this.cerrarAlerta(alerta);
    }, 3000);
  }

  cerrarAlerta(alerta: { mensaje: string, tipo: string }) {
    this.alertas = this.alertas.filter(a => a !== alerta);
  }
}
