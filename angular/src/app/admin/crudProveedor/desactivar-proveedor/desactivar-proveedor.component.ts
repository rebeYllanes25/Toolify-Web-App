import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button';
import { Proveedor } from '../../../shared/model/proveedor.model';
import { ProveedorService } from '../../service/proveedorService';
import { AlertIziToast } from '../../../util/iziToastAlert.service';

@Component({
  selector: 'app-desactivar-proveedor',
  standalone: true,
  imports: [MatDialogModule, CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="title">
        <mat-icon class="icon-warning">warning</mat-icon>
        Confirmar desactivación
      </h2>

      <mat-dialog-content class="content" style="overflow: hidden;">
        <p>¿Seguro que deseas <b>desactivar</b> el proveedor:</p>
        <p class="provider-name">{{ data.razonSocial }}</p>
      </mat-dialog-content>

      <mat-dialog-actions align="end" class="actions">
        <button mat-stroked-button color="primary" (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="warn" (click)="onDesactivar()">Desactivar</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 16px;
      text-align: center;
    }
    .title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 16px;
    }
    .icon-warning {
      color: #f44336; 
      font-size: 2rem;
    }
    .content {
      font-size: 1rem;
      margin-bottom: 24px;
    }
    .provider-name {
      font-weight: 700;
      font-size: 1.2rem;
      color: #333;
      margin-top: 8px;
    }
    .actions button {
      min-width: 100px;
      margin-left: 8px;
    }
  `]
})
export class DesactivarProveedorComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Proveedor,
    private dialogRef: MatDialogRef<DesactivarProveedorComponent>,
    private proveedorService: ProveedorService
  ) {}

  onCancel() {
    this.dialogRef.close(false);
  }

  onDesactivar() {
    this.proveedorService.desactivarProveedor(this.data.idProveedor!).subscribe({
      next: () => {
        this.dialogRef.close(true);
        AlertIziToast.success(`Proveedor desactivado correctamente (ID: ${this.data.idProveedor})`, '¡Éxito!');
      },
      error: (err) => {
        AlertIziToast.error(`No se pudo desactivar el proveedor: ${err}`, 'Error');
      }
    });
  }
}
