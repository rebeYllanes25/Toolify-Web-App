import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../shared/model/producto.model';
import { ProductoServiceService } from '../../service/producto-service.service';

//alert IZI_TOAST_ALERT
import { AlertIziToast } from '../../../util/iziToastAlert.service';
@Component({
  selector: 'app-desactivar-producto',
  standalone : true,
  imports: [
    MatDialogModule,
     CommonModule
  ],
  template : `
    <h2 mat-dialog-title>Confirmar desactivación</h2>
    <mat-dialog-content>
      <p>¿Seguro que quieres desactivar el producto <b>{{ data.nombre }}</b>?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-button color="warn" (click)="onDesactivar()">Desactivar</button>
    </mat-dialog-actions>
  `,

  styleUrl: './desactivar-producto.component.css'
})
export class DesactivarProductoComponent {
constructor (
  @Inject (MAT_DIALOG_DATA) public data : Producto,
  private dialogRef: MatDialogRef<DesactivarProductoComponent>,
    private productoService: ProductoServiceService){}



  onCancel(){
    this.dialogRef.close(false);
  }

  onDesactivar(){
    AlertIziToast.warning(`Estas a punto de desactivar este producto ${this.data.idProducto!}`)
    this.productoService.desactivarProducto(this.data.idProducto!).subscribe({
      next : (data) =>{
        this.dialogRef.close(true);
         AlertIziToast.error(`Desactivaste este producto codigo ${this.data.idProducto!}`,'¡Exito!')
      }
    })
  }
  }


