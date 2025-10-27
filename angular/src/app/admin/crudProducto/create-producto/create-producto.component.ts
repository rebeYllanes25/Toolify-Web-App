import { Component, OnInit } from '@angular/core';
import { ProductoServiceService } from '../../service/producto-service.service';
import { CategoriaServiceService } from '../../service/categoria-service.service';
import { ProveedorService } from '../../service/proveedorService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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
  selector: 'app-create-producto',
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
    MatSelectModule
  ],
  templateUrl: './create-producto.component.html',
  styleUrls: ['./create-producto.component.css']
})
export class CreateProductoComponent implements OnInit {

  producto: Producto = {
    nombre: '',
    descripcion: '',
    proveedor: { idProveedor: 0, distrito: { idDistrito: 0, nombre: '' } },
    categoria: { idCategoria: 0, descripcion: '' },
    precio: 0,
    stock: 0,
    imagen: '',
    fechaRegistro: '',
    estado: true
  };

  categorias$!: Observable<Categoria[]>;
  proveedores$!: Observable<Proveedor[]>;

  imagenPreview: string | null = null;
  imagenFile:  File | null = null;

  constructor(
    private productoService: ProductoServiceService,
    private categoriaService: CategoriaServiceService,
    private proveedorService: ProveedorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categorias$ = this.categoriaService.listaCategorias();
    this.proveedores$ = this.proveedorService.listarProveedor();
  }

 
  onFileSelect(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.imagenFile = file; 
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }


   removeImage(event: Event) {
    event.stopPropagation();
    this.imagenPreview = null;
    this.imagenFile = null;
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  formularioValido(): boolean {
    return !!(
      this.producto.nombre &&
      this.producto.descripcion &&
      this.producto.proveedor?.idProveedor &&
      this.producto.categoria?.idCategoria &&
      this.producto.precio >= 0 &&
      this.producto.stock >= 0 &&
      this.imagenFile 
    );
  }
  // Guardar producto
  guardarProducto(): void {
    if (!this.formularioValido()) {
      AlertIziToast.warning('Por favor completa todos los campos requeridos.');
      return;
    }

    this.producto.fechaRegistro = new Date().toISOString();
    this.producto.estado = true;

      this.productoService.createProducto(this.producto, this.imagenFile).subscribe({
      next: (data) => {
        this.producto = data;
        AlertIziToast.success(`Se guardó el producto ${this.producto.nombre} código: ${this.producto.idProducto}`);
        this.router.navigate(['/admin/crudProducto']);
      },
      error: (err) => {
        console.log('Error:', err);
        AlertIziToast.warning('Error al guardar el producto.');
      }
    });
  }
}
