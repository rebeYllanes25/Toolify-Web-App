import { Component } from '@angular/core';
import { Producto } from '../../shared/model/producto.model';
import { Categoria } from '../../shared/model/categoria.model';
import { ProductoFilter } from '../../shared/dto/productofilter.model';
import { ProductoService } from '../service/producto.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../service/carro.service';
import { AlertService } from '../../util/alert.service';
import { ActivatedRoute } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./producto.component.css'],
})
export class ProductoComponent {
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  filtro: ProductoFilter = { idCategorias: [] };

  paginaActual = 0;
  totalPaginas = 0;
  tamanioPagina = 12;

  ordenPrecio: 'asc' | 'desc' | null = null;
  productoSeleccionado: any = null;
  cantidadSeleccionada: number = 1;
  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0); 
    this.route.queryParams.subscribe(params => {
    const categoriaId = params['categoria'];
    if (categoriaId) {
      this.filtro.idCategorias = [Number(categoriaId)];
    }
    this.cargarProductosYCategorias();
  });
  }

  cargarProductosYCategorias(): void {
    this.productoService
      .getProductosYCategorias(
        this.filtro,
        this.paginaActual,
        this.tamanioPagina,
        this.ordenPrecio ?? undefined // PASAMOS el orden
      )
      .subscribe({
        next: (response) => {
          this.productos = response.productos.content;
          this.totalPaginas = response.productos.totalPages;
          this.paginaActual = response.productos.number;
          this.categorias = response.categorias;
        },
        error: (err) =>
          console.error('Error cargando productos y categorías', err),
      });
  }

  onCategoriaChange(idCategoria: number, isChecked: boolean): void {
    if (isChecked) {
      this.filtro.idCategorias.push(idCategoria);
    } else {
      this.filtro.idCategorias = this.filtro.idCategorias.filter(
        (id) => id !== idCategoria
      );
    }
    this.paginaActual = 0;
    this.cargarProductosYCategorias();
  }

  irAPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPaginas) {
      this.paginaActual = pagina;
      this.cargarProductosYCategorias();
    }
  }
  verDetalles(producto: any) {
    this.productoSeleccionado = producto;
    this.cantidadSeleccionada = 1;

    // Mostrar el modal manualmente con Bootstrap
    const modalElement = document.getElementById('productoModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  cambiarCantidad(delta: number) {
    const nuevaCantidad = this.cantidadSeleccionada + delta;
    if (nuevaCantidad >= 1) {
      this.cantidadSeleccionada = nuevaCantidad;
    }
  }

  agregarAlCarrito(producto: Producto) {
    if (!producto) return;

    try {
      const exito = this.carritoService.agregarProducto(
        producto,
        this.cantidadSeleccionada
      );
      if (!exito) {
        AlertService.error(
          `No hay suficiente stock. Stock disponible: ${producto.stock}`
        );
        return;
      }

      // Cerrar modal tras agregar
      const modalElement = document.getElementById('productoModal');
      if (modalElement) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance?.hide();
      }

      // Reset cantidad a 1 para la próxima vez
      this.cantidadSeleccionada = 1;
    } catch (error) {
      AlertService.error('Error al agregar producto al carrito.');
      console.error(error);
    }
  }

  onOrdenChange(nuevoOrden: 'asc' | 'desc'): void {
    if (this.ordenPrecio === nuevoOrden) {
      this.ordenPrecio = null;
    } else {
      this.ordenPrecio = nuevoOrden;
    }
    this.paginaActual = 0;
    this.cargarProductosYCategorias();
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/no-imagen.jpg';
  }

  get hayFiltrosActivos(): boolean {
    return this.filtro.idCategorias.length > 0 || this.ordenPrecio !== null;
  }

  desactivarFiltros(): void {
    this.filtro.idCategorias = [];
    this.ordenPrecio = null;
    this.paginaActual = 0;
    this.cargarProductosYCategorias();
  }
}
