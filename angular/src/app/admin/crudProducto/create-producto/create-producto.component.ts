import { Component } from '@angular/core';

//service
import { ProductoServiceService } from '../../service/producto-service.service';

//formulario
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
//entidad
import { Producto } from '../../../shared/model/producto.model';
//angular material
import { MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';

//alert IZI_TOAST_ALERT
import { AlertIziToast } from '../../../util/iziToastAlert.service';


@Component({
  selector: 'app-create-producto',
  standalone : true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule
  ],
  templateUrl: './create-producto.component.html',
  styleUrl: './create-producto.component.css'
})
export class CreateProductoComponent {

  producto:Producto = {
      nombre: '',
      descripcion: '',
      proveedor:{
        idProveedor :0,
        distrito :{
          idDistrito :0,
          nombre : ''
        }
      },
      categoria:{idCategoria:0,descripcion:''},
      precio:0,
      stock:0,
      fechaRegistro:'',
      estado:true
  }
  imagenFile?:File

  constructor (
    private productoService:ProductoServiceService,
    private router: Router
  ){}

  onFileSelect(event:any){
    this.imagenFile = event.target.files[0]
  }

  guardarProveedor():void{

    const formData = new FormData();

    formData.append('nombre',this.producto.nombre); 
    formData.append('descripcion',this.producto.descripcion);
    formData.append('proveedor.idProveedor',this.producto.proveedor.idProveedor!.toString());
    formData.append('categoria.idCategoria',this.producto.categoria.idCategoria!.toString());
    formData.append('precio',this.producto.precio.toString());
    formData.append('stock',this.producto.stock.toString());

    if(this.imagenFile){
      formData.append('imagen', this.imagenFile);
    }

    this.productoService.createProducto(formData).subscribe({
      next: (data) =>{
        this.producto = data
        console.log("Producto Creado" + data)
        AlertIziToast.success(`Se guardo el producto ${this.producto.nombre} codigo:${this.producto.idProducto}`)
        this.router.navigate(['/admin/crudProducto/'])
      },
      error : (err) =>{
        console.log("Error: ", err)
      }
    })
  }
}
