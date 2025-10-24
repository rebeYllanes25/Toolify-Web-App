import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../shared/model/producto.model';

@Component({
  selector: 'app-details-producto',
  template: `
    <div class="modal-container">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-content">
          <i class="fa-solid fa-box-open header-icon"></i>
          <div>
            <h2>Detalles del Producto</h2>
            <p class="subtitle">Información completa del producto</p>
          </div>
        </div>
        <button class="btn-close" mat-dialog-close>
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Content -->
      <mat-dialog-content class="modal-content">
        <!-- Imagen del producto -->
        <div class="image-section">
          <div class="image-wrapper">
            <img *ngIf="data.base64Img; else noImageTpl" 
                 [src]="'data:image/jpeg;base64,' + data.base64Img" 
                 alt="Imagen del producto" 
                 class="product-image" />

            <ng-template #noImageTpl>
              <img [src]="'assets/productos/P' + data.idProducto + '.jpg'" 
                   alt="Imagen del producto" 
                   (error)="onImageError($event)"
                   class="product-image" />
            </ng-template>

            <!-- Badge de ID -->
            <div class="id-badge">
              <i class="fa-solid fa-hashtag"></i>
              ID: {{data.idProducto}}
            </div>
          </div>
        </div>

        <!-- Información del producto -->
        <div class="info-section">
          <!-- Nombre destacado -->
          <div class="product-title">
            <i class="fa-solid fa-tag"></i>
            <h3>{{data.nombre}}</h3>
          </div>

          <!-- Descripción -->
          <div class="description-card">
            <div class="card-header">
              <i class="fa-solid fa-align-left"></i>
              <span>Descripción</span>
            </div>
            <p class="description-text">{{data.descripcion}}</p>
          </div>

          <!-- Grid de información -->
          <div class="info-grid">
            <!-- Proveedor -->
            <div class="info-card">
              <div class="info-icon supplier">
                <i class="fa-solid fa-truck"></i>
              </div>
              <div class="info-content">
                <span class="info-label">Proveedor</span>
                <span class="info-value">{{data.proveedor.razonSocial}}</span>
              </div>
            </div>

            <!-- Categoría -->
            <div class="info-card">
              <div class="info-icon category">
                <i class="fa-solid fa-layer-group"></i>
              </div>
              <div class="info-content">
                <span class="info-label">Categoría</span>
                <span class="info-value">{{data.categoria.descripcion}}</span>
              </div>
            </div>

            <!-- Precio -->
            <div class="info-card highlight-price">
              <div class="info-icon price">
                <i class="fa-solid fa-dollar-sign"></i>
              </div>
              <div class="info-content">
                <span class="info-label">Precio Unitario</span>
                <span class="info-value price-value">S/ {{data.precio | number:'1.2-2'}}</span>
              </div>
            </div>

            <!-- Stock -->
            <div class="info-card" [ngClass]="getStockClass()">
              <div class="info-icon stock">
                <i class="fa-solid fa-cubes"></i>
              </div>
              <div class="info-content">
                <span class="info-label">Stock Disponible</span>
                <span class="info-value stock-value">
                  <i class="fa-solid fa-circle stock-indicator"></i>
                  {{data.stock}} unidades
                </span>
              </div>
            </div>
          </div>

          <!-- Información adicional -->
          <div class="additional-info">
            <div class="info-row">
              <i class="fa-solid fa-calendar-plus"></i>
              <div>
                <span class="label">Fecha de Registro</span>
                <span class="value">{{data.fechaRegistro | date:'dd/MM/yyyy HH:mm'}}</span>
              </div>
            </div>
            <div class="info-row">
              <i class="fa-solid fa-toggle-on"></i>
              <div>
                <span class="label">Estado</span>
                <span class="status-badge" [ngClass]="{'active': data.estado, 'inactive': !data.estado}">
                  {{data.estado ? 'Activo' : 'Inactivo'}}
                </span>
              </div>
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
      width: 700px;
      max-width: 95vw;
    }

    /* Header */
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 1.5rem;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
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
      padding: 1.5rem;
    }

    /* Imagen */
    .image-section {
      position: relative;
    }

    .image-wrapper {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .product-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
      display: block;
    }

    .id-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(99, 102, 241, 0.95);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    /* Título del producto */
    .product-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 12px;
      border-left: 4px solid var(--primary-color);
    }

    .product-title i {
      color: var(--primary-color);
      font-size: 1.5rem;
    }

    .product-title h3 {
      margin: 0;
      color: var(--text-primary);
      font-size: 1.25rem;
      font-weight: 600;
    }

    /* Descripción */
    .description-card {
      background: var(--bg-section);
      border-radius: 12px;
      padding: 1rem;
      border: 1px solid var(--border-color);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      color: var(--text-secondary);
      font-weight: 600;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .card-header i {
      color: var(--primary-color);
    }

    .description-text {
      margin: 0;
      color: var(--text-primary);
      line-height: 1.6;
      font-size: 0.95rem;
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
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s ease;
    }

    .info-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .info-card.highlight-price {
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      border-color: #6ee7b7;
    }

    .info-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .info-icon.supplier {
      background: linear-gradient(135deg, #e9d5ff 0%, #ddd6fe 100%);
      color: #8b5cf6;
    }

    .info-icon.category {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      color: #f59e0b;
    }

    .info-icon.price {
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      color: #059669;
    }

    .info-icon.stock {
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      color: #3b82f6;
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
      font-size: 1rem;
      color: var(--text-primary);
      font-weight: 600;
    }

    .price-value {
      color: #059669;
      font-size: 1.25rem;
      font-weight: 700;
    }

    .stock-value {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .stock-indicator {
      font-size: 0.5rem;
    }

    /* Stock classes */
    .info-card.stock-high .stock-indicator {
      color: #10b981;
    }

    .info-card.stock-medium .stock-indicator {
      color: #f59e0b;
    }

    .info-card.stock-low .stock-indicator {
      color: #ef4444;
    }

    /* Información adicional */
    .additional-info {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-radius: 12px;
      padding: 1rem;
      border: 1px solid #bae6fd;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
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
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      display: inline-block;
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
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }

    /* Responsive */
    @media (max-width: 640px) {
      .modal-container {
        width: 100%;
      }

      .info-grid {
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

      .product-image {
        height: 200px;
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
    .description-card,
    .additional-info {
      animation: fadeIn 0.4s ease-out;
    }

    .info-card:nth-child(1) { animation-delay: 0.1s; }
    .info-card:nth-child(2) { animation-delay: 0.2s; }
    .info-card:nth-child(3) { animation-delay: 0.3s; }
    .info-card:nth-child(4) { animation-delay: 0.4s; }
  `]
})
export class DetailsProductoComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Producto) {}

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/no-imagen.jpg';
  }

  getStockClass(): string {
    if (this.data.stock > 50) return 'stock-high';
    if (this.data.stock > 10) return 'stock-medium';
    return 'stock-low';
  }
}