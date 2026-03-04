import { Component, OnInit } from '@angular/core';
import { PedidoDTO } from '../../shared/dto/pedidoDTO.model';
import { PedidoService } from '../service/pedido-service';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../util/alert.service';

@Component({
  selector: 'app-pedido',
  imports: [CommonModule],
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {
  pedidos: PedidoDTO[] = [];
  isLoading = false;

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.cargarPedidosPendientes();
  }

  /** 🔹 Cargar pedidos pendientes */
  cargarPedidosPendientes(): void {
    this.isLoading = true;
    this.pedidoService.listarPedidosPendientes().subscribe({
      next: (data) => {
        this.pedidos = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar pedidos pendientes', err);
        AlertService.error('Ocurrió un error al cargar los pedidos.');
        this.isLoading = false;
      }
    });
  }

  /** 🔹 Aceptar pedido y recargar lista */
  async aceptarPedido(idPedido?: number): Promise<void> {
    if (!idPedido) return;

    const confirm = await AlertService.confirm(
      '¿Deseas aceptar este pedido?',
      'Confirmar acción',
      'Sí, aceptar',
      'Cancelar'
    );

    if (!confirm) return;

    this.pedidoService.actualizarEstadoPedido(idPedido, 'AS').subscribe({
      next: () => {
        AlertService.success('Pedido aceptado correctamente.');
        // 🔁 Volver a cargar la lista actualizada
        this.cargarPedidosPendientes();
      },
      error: (err) => {
        console.error('Error al aceptar pedido', err);
        AlertService.error('No se pudo aceptar el pedido.');
      }
    });
  }
}
