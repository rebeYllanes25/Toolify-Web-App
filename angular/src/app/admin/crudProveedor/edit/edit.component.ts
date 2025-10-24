import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../../service/proveedorService';
import { DistritoService } from '../../service/distrito.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Proveedor } from '../../../shared/model/proveedor.model';
import { Distrito } from '../../../shared/model/distrito.model';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { AlertIziToast } from '../../../util/iziToastAlert.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
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
})
export class EditProveedorComponent implements OnInit {
  proveedor: Proveedor = {
    idProveedor: 0,
    ruc: '',
    razonSocial: '',
    telefono: '',
    direccion: '',
    distrito: { idDistrito: 0, nombre: '' },
    fechaRegistro: '',
    estado: true,
  };

  distritos$!: Observable<Distrito[]>;

  constructor(
    private proveedorService: ProveedorService,
    private distritoService: DistritoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // Cargar proveedor por ID
    this.proveedorService.detalleProveedor(id).subscribe({
      next: (data) => {
        this.proveedor = data;
      },
      error: (error) => console.log(error),
    });

    // Cargar lista de distritos
    this.distritos$ = this.distritoService.listaDistrito();
  }

  actualizarProveedor(): void {
    this.proveedorService
      .actualizarProveedor(this.proveedor.idProveedor!, this.proveedor)
      .subscribe({
        next: (data) => {
          AlertIziToast.success('Proveedor actualizado correctamente');
          console.log('Se actualizó el proveedor code', data.idProveedor);
          this.router.navigate(['/admin/crudProveedor']);
        },
        error: (err) => console.log('Error: ', err),
      });
  }
}
