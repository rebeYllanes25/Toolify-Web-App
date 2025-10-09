import { Component } from '@angular/core';
import { ProveedorService } from '../../service/proveedorService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Proveedor } from '../../../shared/model/proveedor.model';

// Angular Material
import { MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
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
})export class  CreateProveedorComponent{
    proveedor:Proveedor ={
    ruc: '',
    razonSocial: '',
    telefono: '',
    direccion: '',
    distrito: { idDistrito: 0, nombre: '' },
    fechaRegistro: '',
    estado: true
    };

     constructor(private proveedorService: ProveedorService,
                private router : Router
     ) {}
    
     guardarProveedor(): void {
         this.proveedorService.createProveedor(this.proveedor).subscribe({
            next : (data) => {
                console.log("Provedor recibido " + data )
                this.router.navigate(['/admin/crudProveedor'])
            },
            error : (error) => console.log(error)
         })
     }
}