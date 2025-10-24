import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../../service/proveedorService';
import { DistritoService } from '../../service/distrito.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Proveedor } from '../../../shared/model/proveedor.model';
import { Distrito } from '../../../shared/model/distrito.model';
import { Observable } from 'rxjs';

// Angular Material
import { MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AlertIziToast } from '../../../util/iziToastAlert.service';

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
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule
  ]
})
export class CreateProveedorComponent implements OnInit {

    proveedor: Proveedor = {
        ruc: '',
        razonSocial: '',
        telefono: '',
        direccion: '',
        distrito: { idDistrito: 0, nombre: '' },
        fechaRegistro: '',
        estado: true
    };

    distritos$!: Observable<Distrito[]>;

    constructor(
        private proveedorService: ProveedorService,
        private distritoService: DistritoService,
        private router : Router
    ) {}

    ngOnInit(): void {
        this.distritos$ = this.distritoService.listaDistrito();
    }
    
    formularioValido(): boolean {
        const rucValido = /^[0-9]{11}$/.test(this.proveedor.ruc ?? '');
        const razonValida = !!this.proveedor.razonSocial?.trim();
        const distritoValido = !!(this.proveedor.distrito?.idDistrito && this.proveedor.distrito.idDistrito > 0);
        const telefonoValido = this.proveedor.telefono ? /^[0-9]{7,15}$/.test(this.proveedor.telefono) : true;

        return rucValido && razonValida && distritoValido && telefonoValido;
    }

    guardarProveedor(): void {
        if (!this.formularioValido()) {
            AlertIziToast.error('Por favor complete correctamente todos los campos obligatorios.', 'Error');
            return;
        }

        this.proveedorService.createProveedor(this.proveedor).subscribe({
            next: (data) => {
                AlertIziToast.success('Proveedor creado correctamente');
                this.router.navigate(['/admin/crudProveedor']);
            },
            error: (error) => {
                console.error(error);
                AlertIziToast.error('No se pudo crear el proveedor', 'Error');
            }
        });
    }
}
