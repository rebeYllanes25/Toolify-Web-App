import { Component, OnInit } from '@angular/core';

import { ProductoServiceService } from '../../service/producto-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Producto } from '../../../shared/model/producto.model';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';


//alert IZI_TOAST_ALERT
import { AlertIziToast } from '../../../util/iziToastAlert.service';

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
    MatInputModule
  ],
  templateUrl: './edit-producto.component.html',
  styleUrl: './edit-producto.component.css'
})
export class EditProductoComponent implements OnInit {
  producto: Producto = {
    idProducto: 0,
    nombre: '',
    descripcion: '',
    proveedor: {
      idProveedor: 0,
      ruc:'',
      razonSocial:'',
      telefono:'',
      direccion:'',
      fechaRegistro:'',
      estado:true,
      distrito: {
        idDistrito: 0,
        nombre: ''
      }
    },
    categoria: { idCategoria: 0, descripcion: '' },
    precio: 0,
    stock: 0,
    imagenBytes: '',
    base64Img: '',
    fechaRegistro: '',
    estado: true
  }
  //actualiza Spring?
  constructor(
    private productoService: ProductoServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    this.productoService.detalleProducto(id).subscribe({
      next: (data) => {
        this.producto = data
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  //funcion para que obtengamos el archivo seleccionado

  onFileSelect(event: any) {
    const file: File = event.target.files[0];
    if (file) { //si tengo una imagen de la vista
      const reader = new FileReader();

      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        this.producto.base64Img = base64;
        //una vez obtenemos la base64 de la iamgen seleccionada
        //convertimos esto a imagenByte q es lo que se guarda en
        //la base de datos
        this.producto.imagenBytes = this.convertBase64ToByte(base64);
      }
      reader.readAsDataURL(file);
    }
  }

  //funcion para que convierta de base64 a imagenBytes

  convertBase64ToByte(base64: string): string {
    return base64;
  }

  actualizarProducto() {
    this.productoService.actualizarProducto(this.producto.idProducto!, this.producto).subscribe({
      next: (data) => {
        console.log("Se actualizo el producto code", data.idProducto)
        AlertIziToast.info(`Actualizaste el producto ${data.nombre} codigo: ${data.idProducto}`);
        this.router.navigate(['/admin/crudProducto'])
      },
      error: (err) => {
        console.log("error", err)
        console.log("id producto", this.producto.idProducto)
        console.log("nombre ", this.producto.nombre)
        console.log("proveedor", this.producto.proveedor.idProveedor)
        console.log("id producto", this.producto.idProducto)
        console.log("categoria", this.producto.categoria.idCategoria)

        console.log("precio", this.producto.precio)
        console.log("stock", this.producto.stock)
        console.log("IMAGEN BYTE ENVIANDO", this.producto.imagenBytes)
        console.log("IMAGEN 64 OBTENIDO ", this.producto.base64Img)
      }
    })
  }
}
