import { Component, OnInit, ViewChild } from '@angular/core';
import { ProveedorService } from '../service/proveedorService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Proveedor } from '../../shared/model/proveedor.model';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource,MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';

import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';

//import MODAL proveedor
import { MatDialog } from '@angular/material/dialog'
import { DetailsProveedorComponent } from './details/details.component';
import { DesactivarProveedorComponent } from './desactivar-proveedor/desactivar-proveedor.component';


@Component({
  selector: 'app-crudProveedor',
  templateUrl: './crudProveedor.component.html',
  styleUrls: ['./crudProveedor.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule
  ]
})
export class CrudProveedorComponent implements OnInit {

  dataSource = new MatTableDataSource<Proveedor>([]);
  columnas = ['idProveedor', 'ruc', 'razonSocial', 'telefono', 'distrito', 'acciones'];

 @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private proveedorService: ProveedorService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.proveedorService.listarProveedor().subscribe({
      next: (data) => {
        console.log('Proveedores:', data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator; 
      },
      error: (err) => console.log(err)
    });
  }

  abrirModal(p: Proveedor) {
    this.dialog.open(DetailsProveedorComponent, {
      width: '400px',
      data: p
    })
  }


  abrirModelDesactivar(p: Proveedor) {
    this.dialog.open(DesactivarProveedorComponent, {
      width: '500px',
      data: p
    }).afterClosed().subscribe(result => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

};
