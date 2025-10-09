import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepartidorService, VentaDTO } from '../../cliente/service/repartidor.service';
import { catchError, firstValueFrom, forkJoin, map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado',
  templateUrl: './repartidor-listado.component.html',
  styleUrls: ['./repartidor-listado.component.css'],
  imports :[CommonModule]
})
export class RepartidorListadoComponent implements OnInit {
  pedidos: VentaDTO[] = [];
  pedidoSeleccionado: VentaDTO | null = null;

  constructor(private repartidorService: RepartidorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

convertirCoordenadasADireccion(lat?: number, lng?: number): Observable<string> {
  return new Observable(observer => {
    if (lat == null || lng == null) {
      observer.next('Dirección desconocida');
      observer.complete();
      return;
    }

    if (!google || !google.maps || !google.maps.Geocoder) {
      observer.next('Google Maps no cargado');
      observer.complete();
      return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        observer.next(results[0].formatted_address);
        observer.complete();
      } else {
        observer.next('No se pudo obtener dirección');
        observer.complete();
      }
    });
  });
}





cargarPedidos(): void {
  this.repartidorService.obtenerPedidosDeliveryPendientes().subscribe({
    next: (data) => {
      console.log('Datos recibidos del backend:', data); // <-- aquí
      if (!data || data.length === 0) {
        this.pedidos = [];
        return;
      }

      const pedidosConDireccion$ = data.map(pedido =>
        this.convertirCoordenadasADireccion(pedido.latitud, pedido.longitud).pipe(
          map(direccionLegible => ({ ...pedido, direccionLegible }))
        )
      );

      forkJoin(pedidosConDireccion$).subscribe({
        next: pedidos => {
          this.pedidos = pedidos;
          console.log('Pedidos con dirección legible:', this.pedidos);
        },
        error: err => {
          console.error('Error al procesar pedidos:', err);
          this.pedidos = data; // fallback
        }
      });
    },
    error: err => console.error('Error al traer pedidos:', err)
  });
}
  verDetalle(pedido: VentaDTO) {
    console.log('Pedido que se va a enviar:', pedido);
  this.router.navigate(['/repartidor/inicio'], { state: { pedido } });
}

  cerrarDetalle() {
    this.pedidoSeleccionado = null;
  }

  confirmarEntrega() {
    if (this.pedidoSeleccionado) {
      alert(`Entrega confirmada para ${this.pedidoSeleccionado.usuario.nombres}`);
      this.cerrarDetalle();
    }
  }
}

