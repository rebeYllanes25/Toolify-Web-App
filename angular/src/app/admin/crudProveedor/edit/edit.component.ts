import { Component, OnInit } from '@angular/core';
import {  ProveedorService } from '../../service/proveedorService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule,ActivatedRoute } from '@angular/router';
import { Proveedor } from '../../../shared/model/proveedor.model';

// Angular Material
import { MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  standalone : true,
  imports : [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule
  ]
})export class  EditProveedorComponent implements OnInit{
   
  proveedor: Proveedor = {
    idProveedor: 0,
    ruc: '',
    razonSocial: '',
    telefono: '',
    direccion: '',
    distrito: { idDistrito: 0, nombre: '' },
    fechaRegistro: '',
    estado: true
  };

constructor(
      private proveedorService:ProveedorService,
      private router:Router,
      private route:ActivatedRoute
){}



ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    this.proveedorService.detalleProveedor(id).subscribe({
            next: (data) => {
                this.proveedor = data
            },
            error: (error) =>{
                console.log(error)
            }
        });
}

actualizarProveedor():void{
    this.proveedorService.actualizarProveedor(this.proveedor.idProveedor!, this.proveedor).subscribe({
        next: (data) =>{
            console.log("Se actualizo el proveedor code", data.idProveedor)
             this.router.navigate(['/admin/crudProveedor'])
        },
        error: (err) => {
            console.log("Error: ", err)
        }

    })
}
  
}