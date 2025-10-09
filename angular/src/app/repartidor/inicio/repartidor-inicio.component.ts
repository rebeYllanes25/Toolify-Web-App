import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../cliente/service/auth.service';
import { UserService } from '../../cliente/service/user.service';
import { VentaDTO } from '../../shared/dto/ventaDTO.model';
import {
  RepartidorService,
  VentaDeliveryDTO,
} from '../../cliente/service/repartidor.service';
import {
  GoogleMap,
  MapDirectionsRenderer,
  MapMarker,
} from '@angular/google-maps';
import { Router } from '@angular/router';
import { AlertService } from '../../util/alert.service';

// Define a new type for your marker data
interface MarkerOptions {
  position: google.maps.LatLngLiteral;
  label: string;
}

@Component({
  selector: 'app-repartidor-inicio',
  templateUrl: './repartidor-inicio.component.html',
  styleUrls: ['./repartidor-inicio.component.css'],
  imports: [GoogleMap, MapMarker, MapDirectionsRenderer, CommonModule],
})
export class RepartidorInicioComponent implements OnInit {
  repartidor: string = '';
  ubicacion: string = '';
  pedidos: VentaDTO[] = [];
  cargando: boolean = false;
  fechaActual: string = new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

posicionActual: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
pasos: google.maps.LatLngLiteral[] = [];
indicePaso: number = 0;

  simulandoRecorrido: boolean = false;
  tiempoRestante: number = 10; // segundos para simular entrega
  intervalId?: any;

  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom = 15;
  pedidoSeleccionado?: VentaDeliveryDTO;
  directions: google.maps.DirectionsResult | null = null;

  myLocation: google.maps.LatLngLiteral = { lat: 0, lng: 0 };

  // Use the new type for the markers array
  markers: MarkerOptions[] = [];

  constructor(
    private repartidorService: RepartidorService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatosRepartidor();
    this.cargarPedidos();

    const statePedido = history.state.pedido as VentaDeliveryDTO | undefined;

    if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    position => {
      this.myLocation = { 
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      this.center = this.myLocation; 
      
      this.markers.push({ position: this.myLocation, label: 'Yo' });

      if (statePedido) {
        this.pedidoSeleccionado = statePedido;
        this.mostrarRuta(this.pedidoSeleccionado);
      }
    },
    error => console.error('Error obteniendo ubicación', error)
  );
}

    
  }
generarPasos(inicio: google.maps.LatLngLiteral, fin: google.maps.LatLngLiteral, numPasos: number): google.maps.LatLngLiteral[] {
  const pasos: google.maps.LatLngLiteral[] = [];
  const latStep = (fin.lat - inicio.lat) / numPasos;
  const lngStep = (fin.lng - inicio.lng) / numPasos;

  for(let i = 1; i <= numPasos; i++) {
    pasos.push({
      lat: inicio.lat + latStep * i,
      lng: inicio.lng + lngStep * i
    });
  }
  return pasos;
}

  cargarDatosRepartidor(): void {
    const user = this.userService.getUser();
    if (user) {
      this.repartidor = `${user.nombres} ${user.apePaterno}`;
      this.ubicacion = user.direccion || 'Ubicación no registrada';
    } else {
      this.repartidor = 'Invitado';
      this.ubicacion = '';
    }
  }

  cargarPedidos(): void {
    this.cargando = true;
    this.repartidorService.obtenerPedidosDeliveryPendientes().subscribe({
      next: (data) => {
        this.pedidos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar pedidos:', err);
        this.cargando = false;
      },
    });
  }

  verDetalle(pedido: VentaDTO) {
    this.router.navigate(['/repartidor/inicio'], { state: { pedido } });
  }

  mostrarRuta(pedido: VentaDeliveryDTO) {
  if (!pedido?.latitud || !pedido?.longitud) return;

  this.center = { lat: pedido.latitud, lng: pedido.longitud };

  // Limpia marcadores para mostrar solo los nuevos
  this.markers = [];

  // Añade marcador "Yo"
  this.markers.push({ position: this.myLocation, label: 'Yo' });
  // Añade marcador del pedido
  this.markers.push({ position: { lat: pedido.latitud, lng: pedido.longitud }, label: 'Pedido' });

  const directionsService = new google.maps.DirectionsService();
  directionsService.route(
    {
      origin: this.myLocation,
      destination: { lat: pedido.latitud, lng: pedido.longitud },
      travelMode: google.maps.TravelMode.DRIVING
    },
    (result, status) => {
      if (status === 'OK' && result) {
        this.directions = result;

        // Extraemos los puntos de la ruta para animar el marcador
        this.pasos = this.extraerPuntosDeRuta(result);
        this.indicePaso = 0;
        this.posicionActual = { ...this.myLocation };

      } else {
        console.error('Error mostrando ruta:', status);
        this.directions = null;
        this.pasos = [];
      }
    }
  );
}


  iniciarPedido(pedido: VentaDeliveryDTO): void {
  if (this.pasos.length === 0) {
    alert('No hay ruta para simular el recorrido');
    return;
  }

  this.pedidoSeleccionado = pedido;
  this.simulandoRecorrido = true;
  this.tiempoRestante = this.pasos.length; // o calcula un tiempo a gusto

  // Limpia intervalos previos
  if (this.intervalId) clearInterval(this.intervalId);

  let salto = 3; 

this.intervalId = setInterval(() => {
  if (this.indicePaso < this.pasos.length) {
    this.posicionActual = this.pasos[this.indicePaso];
    this.actualizarMarcadorYo();
    this.indicePaso += salto;  // salta varios puntos a la vez
    this.tiempoRestante -= salto;
  } else {
    clearInterval(this.intervalId);
    this.confirmarEntregaSimulada(pedido.idVenta);
    this.simulandoRecorrido = false;
  }
}, 100); // cada 300ms se mueve al siguiente punto
}

actualizarMarcadorYo(): void {
  // Elimina el marcador "Yo" anterior y agrega uno nuevo en la posición actualizada
  this.markers = this.markers.filter(m => m.label !== 'Yo');
  this.markers.push({ position: this.posicionActual, label: 'Yo' });
}

  confirmarEntregaSimulada(idVenta: number): void {
  this.repartidorService.marcarPedidoComoEntregado(idVenta).subscribe({
    next: (mensaje) => {
      AlertService.success(mensaje);
      this.simulandoRecorrido = false;
      this.pedidoSeleccionado = undefined;
      this.cargarPedidos();
    },
    error: (err) => {
      console.error('Error al confirmar entrega:', err);
      alert('Error al confirmar entrega');
    },
  });
}


  extraerPuntosDeRuta(directionsResult: google.maps.DirectionsResult): google.maps.LatLngLiteral[] {
  const puntos: google.maps.LatLngLiteral[] = [];

  if (!directionsResult.routes || directionsResult.routes.length === 0) {
    return puntos;
  }

  const route = directionsResult.routes[0];

  for (const leg of route.legs) {
    for (const step of leg.steps) {
      // Cada step tiene un array de LatLng
      for (const latlng of step.path) {
        puntos.push({ lat: latlng.lat(), lng: latlng.lng() });
      }
    }
  }

  return puntos;
}

}
