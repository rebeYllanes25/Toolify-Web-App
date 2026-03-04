import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Proveedor } from '../../../shared/model/proveedor.model';

@Component({
  selector: 'app-details-proveedor',
  template: `
    <div class="modal-container">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-content">
          <i class="fa-solid fa-truck header-icon"></i>
          <div>
            <h2>Detalles del Proveedor</h2>
            <p class="subtitle">Información completa del proveedor</p>
          </div>
        </div>
        <button class="btn-close" mat-dialog-close>
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Content -->
      <mat-dialog-content class="modal-content">
        <!-- Título con razón social -->
        <div class="supplier-title">
          <i class="fa-solid fa-building"></i>
          <h3>{{data.razonSocial}}</h3>
        </div>

        <!-- Grid de información principal -->
        <div class="info-grid">
          <!-- ID -->
          <div class="info-card">
            <div class="info-icon id">
              <i class="fa-solid fa-hashtag"></i>
            </div>
            <div class="info-content">
              <span class="info-label">ID Proveedor</span>
              <span class="info-value">{{data.idProveedor}}</span>
            </div>
          </div>

          <!-- RUC -->
          <div class="info-card highlight-ruc">
            <div class="info-icon ruc">
              <i class="fa-solid fa-file-invoice"></i>
            </div>
            <div class="info-content">
              <span class="info-label">RUC</span>
              <span class="info-value ruc-value">{{data.ruc}}</span>
            </div>
          </div>

          <!-- Teléfono -->
          <div class="info-card">
            <div class="info-icon phone">
              <i class="fa-solid fa-phone"></i>
            </div>
            <div class="info-content">
              <span class="info-label">Teléfono</span>
              <span class="info-value">{{data.telefono}}</span>
            </div>
          </div>

          <!-- Distrito -->
          <div class="info-card">
            <div class="info-icon location">
              <i class="fa-solid fa-map-marker-alt"></i>
            </div>
            <div class="info-content">
              <span class="info-label">Distrito</span>
              <span class="info-value">{{data.distrito.nombre}}</span>
            </div>
          </div>
        </div>

        <!-- Dirección completa -->
        <div class="address-card">
          <div class="card-header">
            <i class="fa-solid fa-location-dot"></i>
            <span>Dirección Completa</span>
          </div>
          <div class="address-content">
            <i class="fa-solid fa-map"></i>
            <p>{{data.direccion}}</p>
          </div>
          <div class="location-badge">
            <i class="fa-solid fa-map-pin"></i>
            {{data.distrito.nombre}}
          </div>
        </div>

        <!-- Información adicional -->
        <div class="additional-info">
          <div class="info-row">
            <i class="fa-solid fa-circle-info"></i>
            <div>
              <span class="label">Estado del Proveedor</span>
              <span class="status-badge" [ngClass]="{'active': data.estado, 'inactive': !data.estado}">
                <i class="fa-solid" [ngClass]="{'fa-circle-check': data.estado, 'fa-circle-xmark': !data.estado}"></i>
                {{data.estado ? 'Activo' : 'Inactivo'}}
              </span>
            </div>
          </div>
          <div class="info-row" *ngIf="data.fechaRegistro">
            <i class="fa-solid fa-calendar-plus"></i>
            <div>
              <span class="label">Fecha de Registro</span>
              <span class="value">{{data.fechaRegistro | date:'dd/MM/yyyy HH:mm'}}</span>
            </div>
          </div>
        </div>
      </mat-dialog-content>

      <!-- Actions -->
      <mat-dialog-actions class="modal-actions">
        <button class="btn-close-modal" mat-dialog-close>
          <i class="fa-solid fa-xmark me-2"></i>
          Cerrar
        </button>
      </mat-dialog-actions>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  styles: [`
    /* Modal Container */
    .modal-container {
      display: flex;
      flex-direction: column;
      max-height: 90vh;
      width: 750px;
      max-width: 95vw;
    }

    /* Header */
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 1.5rem;
      background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
      color: white;
      border-radius: 12px 12px 0 0;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .header-icon {
      font-size: 2rem;
      background: rgba(255, 255, 255, 0.2);
      padding: 0.75rem;
      border-radius: 12px;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .subtitle {
      margin: 0.25rem 0 0 0;
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .btn-close {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }

    .btn-close:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: rotate(90deg);
    }

    /* Content */
    ::ng-deep .mat-dialog-content {
      padding: 0 !important;
      margin: 0 !important;
      overflow-x: hidden !important;
    }

    .modal-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 2rem;
    }

    /* Título del proveedor */
    .supplier-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.25rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 12px;
      border-left: 4px solid #8b5cf6;
    }

    .supplier-title i {
      color: #8b5cf6;
      font-size: 1.75rem;
    }

    .supplier-title h3 {
      margin: 0;
      color: var(--text-primary);
      font-size: 1.35rem;
      font-weight: 600;
    }

    /* Grid de información */
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .info-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s ease;
    }

    .info-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .info-card.highlight-ruc {
      background: linear-gradient(135deg, #ddd6fe 0%, #e9d5ff 100%);
      border-color: #c4b5fd;
    }

    .info-icon {
      width: 56px;
      height: 56px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .info-icon.id {
      background: linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%);
      color: #6366f1;
    }

    .info-icon.ruc {
      background: linear-gradient(135deg, #ddd6fe 0%, #e9d5ff 100%);
      color: #8b5cf6;
    }

    .info-icon.phone {
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      color: #059669;
    }

    .info-icon.location {
      background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
      color: #ea580c;
    }

    .info-content {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      flex: 1;
    }

    .info-label {
      font-size: 0.8rem;
      color: var(--text-secondary);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      font-size: 1.1rem;
      color: var(--text-primary);
      font-weight: 600;
    }

    .ruc-value {
      color: #8b5cf6;
      font-size: 1.2rem;
      font-weight: 700;
    }

    /* Dirección */
    .address-card {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border-radius: 12px;
      padding: 1.25rem;
      border: 1px solid #fbbf24;
      position: relative;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      color: #92400e;
      font-weight: 600;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .card-header i {
      color: #f59e0b;
      font-size: 1.1rem;
    }

    .address-content {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .address-content i {
      color: #f59e0b;
      font-size: 1.25rem;
      margin-top: 0.25rem;
    }

    .address-content p {
      margin: 0;
      color: #92400e;
      font-size: 1.05rem;
      font-weight: 500;
      line-height: 1.6;
      flex: 1;
    }

    .location-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #fbbf24;
      color: #78350f;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.9rem;
    }

    /* Información adicional */
    .additional-info {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-radius: 12px;
      padding: 1.25rem;
      border: 1px solid #bae6fd;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .info-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .info-row i {
      color: #0284c7;
      font-size: 1.25rem;
      width: 28px;
      text-align: center;
    }

    .info-row > div {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      flex: 1;
    }

    .info-row .label {
      font-size: 0.85rem;
      color: #075985;
      font-weight: 500;
    }

    .info-row .value {
      font-size: 0.95rem;
      color: #0c4a6e;
      font-weight: 600;
    }

    .status-badge {
      padding: 0.375rem 0.875rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge.active {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.inactive {
      background: #fee2e2;
      color: #991b1b;
    }

    .status-badge i {
      font-size: 0.9rem;
    }

    /* Tarjeta de contacto */
    .contact-card {
      background: white;
      border: 2px solid var(--border-color);
      border-radius: 12px;
      padding: 1.25rem;
    }

    .contact-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-color);
    }

    .contact-header i {
      color: #8b5cf6;
      font-size: 1.5rem;
    }

    .contact-header h4 {
      margin: 0;
      color: var(--text-primary);
      font-size: 1.1rem;
      font-weight: 600;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .contact-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 0.875rem 1.25rem;
      border-radius: 10px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .phone-btn {
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      color: #065f46;
      border: 1px solid #6ee7b7;
    }

    .phone-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .map-btn {
      background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
      color: #9a3412;
      border: 1px solid #fb923c;
    }

    .map-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
    }

    .contact-button i {
      font-size: 1.25rem;
    }

    /* Actions */
    ::ng-deep .mat-dialog-actions {
      padding: 1rem 1.5rem !important;
      margin: 0 !important;
      border-top: 1px solid var(--border-color);
      background: var(--bg-section);
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
    }

    .btn-close-modal {
      padding: 0.75rem 1.5rem;
      background: white;
      border: 1.5px solid var(--border-color);
      color: var(--text-secondary);
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      font-size: 0.95rem;
    }

    .btn-close-modal:hover {
      background: #8b5cf6;
      color: white;
      border-color: #8b5cf6;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    }

    /* Responsive */
    @media (max-width: 640px) {
      .modal-container {
        width: 100%;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .contact-grid {
        grid-template-columns: 1fr;
      }

      .modal-header {
        padding: 1rem;
      }

      .header-icon {
        font-size: 1.5rem;
        padding: 0.5rem;
      }

      .modal-header h2 {
        font-size: 1.25rem;
      }
    }

    /* Animaciones */
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .info-card,
    .address-card,
    .additional-info,
    .contact-card {
      animation: fadeIn 0.4s ease-out;
    }

    .info-card:nth-child(1) { animation-delay: 0.1s; }
    .info-card:nth-child(2) { animation-delay: 0.2s; }
    .info-card:nth-child(3) { animation-delay: 0.3s; }
    .info-card:nth-child(4) { animation-delay: 0.4s; }
  `]
})
export class DetailsProveedorComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Proveedor) {}
}