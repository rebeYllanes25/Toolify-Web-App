import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Proveedor } from '../../../shared/model/proveedor.model';


@Component({
  selector: 'app-details',
  template: `
    <h2 mat-dialog-title>Detalles del Proveedor</h2>
    <mat-dialog-content>
      <p><strong>ID:</strong> {{data.idProveedor}}</p>
      <p><strong>RUC:</strong> {{data.ruc}}</p>
      <p><strong>Razón Social:</strong> {{data.razonSocial}}</p>
      <p><strong>Teléfono:</strong> {{data.telefono}}</p>
      <p><strong>Dirección:</strong> {{data.direccion}}</p>
      <p><strong>Distrito:</strong> {{data.distrito.nombre}}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [CommonModule, MatDialogModule]
})
export class DetailsProveedorComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Proveedor) {}
}