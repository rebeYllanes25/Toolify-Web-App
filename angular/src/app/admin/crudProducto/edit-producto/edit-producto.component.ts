import { Component, OnInit } from '@angular/core';
import { ProductoServiceService } from '../../service/producto-service.service';
import { CategoriaServiceService } from '../../service/categoria-service.service';
import { ProveedorService } from '../../service/proveedorService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Producto } from '../../../shared/model/producto.model';
import { Categoria } from '../../../shared/model/categoria.model';
import { Proveedor } from '../../../shared/model/proveedor.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AlertIziToast } from '../../../util/iziToastAlert.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-producto',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './edit-producto.component.html',
  styleUrls: ['./edit-producto.component.css'],
})
export class EditProductoComponent implements OnInit {
  producto: Producto = {
    idProducto: 0,
    nombre: '',
    descripcion: '',
    proveedor: { idProveedor: 0, distrito: { idDistrito: 0, nombre: '' } },
    categoria: { idCategoria: 0, descripcion: '' },
    precio: 0,
    stock: 0,
    imagenBytes: '',
    base64Img: '',
    fechaRegistro: '',
    estado: true,
  };

  proveedores$!: Observable<Proveedor[]>;
  categorias$!: Observable<Categoria[]>;

  constructor(
    private productoService: ProductoServiceService,
    private categoriaService: CategoriaServiceService,
    private proveedorService: ProveedorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Cargar listas de proveedores y categorías
    this.proveedores$ = this.proveedorService.listarProveedor();
    this.categorias$ = this.categoriaService.listaCategorias();

    // Cargar producto
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productoService.detalleProducto(id).subscribe({
      next: (data) => {
        this.producto = data;
      },
      error: (err) => console.log(err),
    });
  }

  imagenPreview: string | null = null;
  imagenFile: File | null = null;
  imagenCambiada: boolean = false;

  onFileSelect(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        this.producto.base64Img = base64;
        this.producto.imagenBytes = base64; // aquí puedes usar lo mismo si tu backend espera bytes en base64
      };
      reader.readAsDataURL(file);
    }
  }

  actualizarProducto() {
    if (!this.producto.base64Img) {
      AlertIziToast.warning(
        'Debes seleccionar una imagen o mantener la actual.'
      );
      return;
    }

    this.productoService
      .actualizarProducto(this.producto.idProducto!, this.producto)
      .subscribe({
        next: (data) => {
          AlertIziToast.info(
            `Actualizaste el producto ${data.nombre} código: ${data.idProducto}`
          );
          this.router.navigate(['/admin/crudProducto']);
        },
        error: (err) => console.log('error', err),
      });
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.imagenPreview = null;
    this.imagenFile = null;
    this.imagenCambiada = false;

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/no-imagen.jpg';
  }
}
