import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Proveedor } from '../../../shared/model/proveedor.model';
import { ProveedorService } from '../../service/proveedorService';
@Component({
  selector: 'app-desactivar-proveedor',
  standalone : true,
  imports: [
     MatDialogModule,
     CommonModule
  ],
  template : `
    <h2 mat-dialog-title>Confirmar desactivación</h2>
    <mat-dialog-content>
      <p>¿Seguro que quieres desactivar el proveedor <b>{{ data.razonSocial }}</b>?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-button color="warn" (click)="onDesactivar()">Desactivar</button>
    </mat-dialog-actions>
  `,
  styleUrl: './desactivar-proveedor.component.css'
})
export class DesactivarProveedorComponent {
constructor (
  @Inject (MAT_DIALOG_DATA) public data : Proveedor,
  private dialogRef: MatDialogRef<DesactivarProveedorComponent>,
  private proveedorService: ProveedorService){}

  onCancel(){
    this.dialogRef.close(false);
  }

  onDesactivar(){
    this.proveedorService.desactivarProveedor(this.data.idProveedor!).subscribe({
      next : (mensaje) =>{
        this.dialogRef.close(true);
      }
    })
  }
}
