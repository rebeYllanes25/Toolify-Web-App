import { Component,Inject } from '@angular/core';

//modal
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../shared/model/producto.model';

@Component({
  selector: 'app-details-producto',
    template: `
       <h2 mat-dialog-title>Detalles del Producto</h2>
    <mat-dialog-content class="details-container">
      <div class="image-container">
        <img [src]="'data:imagen/jpeg;base64,' + data.base64Img" alt="Imagen del producto" />
      </div>

      <div class="info-container">
        <p><strong>ID:</strong> {{data.idProducto}}</p>
        <p><strong>Nombre:</strong> {{data.nombre}}</p>
        <p><strong>Descripción:</strong> {{data.descripcion}}</p>
        <p><strong>Proveedor:</strong> {{data.proveedor.razonSocial}}</p>
        <p><strong>Categoría:</strong> {{data.categoria.descripcion}}</p>
        <p><strong>Precio:</strong> <span class="precio">S/. {{data.precio}}</span></p>
        <p><strong>Stock:</strong> {{data.stock}} unidades</p>
        <p><strong>Registrado:</strong> {{data.fechaRegistro | date:'dd/MM/yyyy HH:mm'}}</p>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-stroked-button mat-dialog-close color="primary">Cerrar</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  styleUrls: ['./details-producto.component.css'],
})
export class DetailsProductoComponent {
   constructor(@Inject(MAT_DIALOG_DATA) public data:Producto) 
   {}
}
