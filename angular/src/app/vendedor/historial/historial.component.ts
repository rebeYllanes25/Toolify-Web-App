import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ReporteService } from '../service/reporte.service';
import { CommonModule } from '@angular/common';
import { VentaDTO } from '../../shared/dto/ventaDTO.model';
import { CarroService } from '../service/carro.service';
import { CompraService } from '../../cliente/service/compra.service';
import { saveAs } from 'file-saver';
declare var bootstrap: any;

@Component({
  selector: 'app-historial',
  imports: [CommonModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  totalVentas: number = 0;
  totalProductosVendidos: number = 0;
  ingresosTotales: number = 0;

  ventas: VentaDTO[] = [];
  ventaSeleccionada: VentaDTO | null = null;

  constructor(
    private reporteService: ReporteService,
    private carroService: CarroService,
    private compraService: CompraService
  ) { }

  ngOnInit(): void {
    this.cargarDatosTotales();
    this.cargarVentasUsuario(3); // MOMENTÁNEO
  }

  cargarDatosTotales(): void {
    forkJoin({
      ventas: this.reporteService.obtenerTotalVentas(),
      productos: this.reporteService.obtenerTotalProductosVendidos(),
      ingresos: this.reporteService.obtenerIngresosTotales()
    }).subscribe({
      next: resultados => {
        this.totalVentas = resultados.ventas;
        this.totalProductosVendidos = resultados.productos;
        this.ingresosTotales = resultados.ingresos;
      },
      error: err => console.error('Error al cargar datos totales', err)
    });
  }

  cargarVentasUsuario(idUsuario: number): void {
    this.carroService.listarVentasVendedor(idUsuario).subscribe({
      next: (ventas: VentaDTO[]) => {
        this.ventas = ventas;
        console.log('Ventas cargadas:', this.ventas);
      },
      error: err => console.error('Error al cargar ventas del usuario', err)
    });
  }

  abrirDetalle(venta: VentaDTO): void {
    this.ventaSeleccionada = venta;
    const modalEl = document.getElementById('detalleVentaModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  descargarPDF(venta: VentaDTO): void {
    const clienteId = venta.usuario?.idUsuario;
    if (!clienteId) return;

    this.compraService.descargarComprobante(clienteId, venta.idVenta).subscribe({
      next: (data: Blob) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        saveAs(blob, `venta_${venta.idVenta}.pdf`);
      },
      error: (err) => {
        console.error('Error al descargar PDF:', err);
      }
    });
  }
}