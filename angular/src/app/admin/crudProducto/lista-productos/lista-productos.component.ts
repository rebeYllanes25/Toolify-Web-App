import { Component, OnInit, ViewChild } from '@angular/core';

//service
import { ProductoServiceService } from '../../service/producto-service.service';

//formulario
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
//entidad
import { Producto } from '../../../shared/model/producto.model';
//angular material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';

//import MODAL Producto
import { MatDialog } from '@angular/material/dialog'
import { DetailsProductoComponent } from '../details-producto/details-producto.component';
import { DesactivarProductoComponent } from '../desactivar-producto/desactivar-producto.component'

//alert IZI_TOAST_ALERT
import { AlertIziToast } from '../../../util/iziToastAlert.service';

@Component({
  selector: 'app-lista-productos',
  standalone : true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
   MatPaginatorModule
],
  templateUrl: './lista-productos.component.html',
  styleUrl: './lista-productos.component.css'
})
export class ListaProductosComponent implements OnInit {

  dataSource = new MatTableDataSource<Producto>([]);
  columnas: string[] = ['idProducto', 'nombre', 'proveedor', 'categoria', 'precio', 'stock', 'acciones'];



 @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(
    private productoService: ProductoServiceService,
    private dialog: MatDialog

  ) { }

  ngOnInit(): void {
    this.productoService.listarProductos().subscribe({
      next: (data) => {
        console.log('Productos obteneidos', data)
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator; 
      },
      error: (err) => {
        console.log('Error', err)
      }
    })
  }

  abrirModalProducto(p: Producto) {
    this.dialog.open(DetailsProductoComponent, {
      width: '500px',
      data: p
    })
  }



  abrirModelDesactivar(p: Producto) {
    this.dialog.open(DesactivarProductoComponent, {
      width: '500px',
      data: p
    }).afterClosed().subscribe(result => {
      if (result) {
        this.ngOnInit();
      }
    });
  }
}