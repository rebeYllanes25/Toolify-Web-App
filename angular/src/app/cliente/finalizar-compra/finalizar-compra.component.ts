import { Component, OnInit, ViewChild } from '@angular/core';
import { DetalleVenta } from '../../shared/model/detalleVenta.model';
import { CarritoService } from '../service/carro.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompraService } from '../service/compra.service';
import { Venta } from '../../shared/model/venta.model';
import { Usuario } from '../../shared/model/usuario.model';
import { AlertService } from '../../util/alert.service';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { GoogleMapsModule, MapMarker } from '@angular/google-maps';
import { VentaDeliveryDTO } from '../service/repartidor.service';

declare var bootstrap: any;
declare var google: any;

@Component({
  selector: 'app-finalizar-compra',
  imports: [CommonModule, FormsModule, GoogleMapsModule],
  templateUrl: './finalizar-compra.component.html',
  styleUrl: './finalizar-compra.component.css',
})
export class FinalizarCompraComponent implements OnInit {
  carrito: DetalleVenta[] = [];
  total: number = 0;
  metodoEntrega: 'S' | 'D' = 'S';
  zoom = 15;
  center: google.maps.LatLngLiteral = { lat: -12.0464, lng: -77.0428 };
  lat: number | null = null;
  lng: number | null = null;
  especificaciones: String = '';
  direccionObtenida: string = ''; // Nueva propiedad

  @ViewChild('marker') marker!: MapMarker;

  meses = Array.from({ length: 12 }, (_, i) => i + 1);
  anios = Array.from({ length: 46 }, (_, i) => 2025 + i);

  tarjeta = {
    numero: '',
    mes: '',
    anio: '',
    cvv: '',
  };
  usuario!: Usuario;

  constructor(
    private carritoService: CarritoService,
    private compraService: CompraService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.carritoService.getCarritoObservable().subscribe((items) => {
      this.carrito = items;
      this.total = this.carritoService.getTotal();
    });

    if (this.authService.isLoggedIn()) {
      this.authService.getUsuario().subscribe({
        next: (usuario) => {
          if (usuario && usuario.nombres) {
            this.usuario = usuario;

            if (usuario.latitud && usuario.longitud) {
              this.center = { lat: usuario.latitud, lng: usuario.longitud };
              this.lat = usuario.latitud;
              this.lng = usuario.longitud;
              this.obtenerDireccionDesdeCoordinatas(this.lat, this.lng);
            } else {
              this.center = { lat: -12.0464, lng: -77.0428 };
              this.lat = this.center.lat;
              this.lng = this.center.lng;
              this.obtenerDireccionDesdeCoordinatas(this.lat, this.lng);
            }
          } else {
            AlertService.error('Tus datos de usuario no están completos.');
            this.authService.logout();
          }
        },
        error: (error) => {
          console.error('Error al cargar datos de usuario:', error);
          AlertService.error('Error al cargar tus datos. Intenta recargar la página.');
          this.authService.logout();
        }
      });
    } else {
      this.router.navigate(['/login'], { queryParams: { message: 'login_required' } });
    }
  }

  // Método para obtener la dirección a partir de coordenadas
 obtenerDireccionDesdeCoordinatas(lat: number | null, lng: number | null): void {
  if (!lat || !lng) {
    console.warn('Coordenadas inválidas');
    return;
  }

  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      console.log('Respuesta Nominatim:', data);
      
      // Intenta obtener diferentes campos de la respuesta
      const address = data.address || {};
      this.direccionObtenida = 
        address.road || 
        address.street ||
        address.neighbourhood ||
        address.village ||
        address.town ||
        address.city ||
        data.display_name || 
        `${lat}, ${lng}`;
      
      console.log('Dirección obtenida:', this.direccionObtenida);
    })
    .catch(error => {
      console.error('Error al obtener dirección de Nominatim:', error);
      this.direccionObtenida = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    });
}


  aumentarCantidad(idProducto: number) {
    try {
      this.carritoService.aumentarCantidad(idProducto);
    } catch (error) {
      AlertService.error(String(error));
    }
  }

  disminuirCantidad(idProducto: number) {
    this.carritoService.disminuirCantidad(idProducto);
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/no-imagen.jpg';
  }

  realizarPago() {
    if (this.carrito.length === 0) {
      AlertService.info('El carrito está vacío.');
      return;
    }

    if (this.metodoEntrega === 'D' && (!this.lat || !this.lng)) {
      AlertService.error('Debes seleccionar tu ubicación en el mapa.');
      return;
    }

    const ventaParaBackend: any = {
      usuario: {
        idUsuario: this.usuario.idUsuario
      },
      metodoEntrega: this.metodoEntrega,
      detalles: this.carrito.map(d => ({
        producto: {
          idProducto: d.producto.idProducto
        },
        cantidad: d.cantidad
      })),
      pedido: {
        direccionEntrega: this.metodoEntrega === 'D' ? this.direccionObtenida : null,
        latitud: this.metodoEntrega === 'D' ? this.lat : null,
        longitud: this.metodoEntrega === 'D' ? this.lng : null
      },
      especificaciones: this.especificaciones
    };

    this.compraService.guardarVentaDelivery(ventaParaBackend).subscribe({
      next: response => {
        if (response.valor) {
          AlertService.success(response.mensaje);
          this.carritoService.limpiarCarrito();

          const modalElement = document.getElementById('modalPago');
          if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
              modal.hide();
            }
          }
        } else {
          AlertService.error(response.mensaje);
        }
      },
      error: err => {
        AlertService.error('Error al procesar la compra: ' + err.message);
      }
    });
  }

  abrirModalPago() {
    const isLoggedIn = this.authService.isLoggedIn();
    console.log('User is logged in:', isLoggedIn);

    if (isLoggedIn) {
      if (this.usuario && this.usuario.nombres) {
        const modal = new bootstrap.Modal(document.getElementById('modalPago')!);
        modal.show();
      } else {
        AlertService.error('Tus datos de usuario no están completos. Intenta recargar la página.');
      }
    } else {
      console.log('User is not logged in. Redirecting to login page...');
      this.router.navigate(['/login'], { queryParams: { message: 'login_required' } });
    }
  }

  formatearNumeroTarjeta() {
    let num = this.tarjeta.numero.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formatted = num.match(/.{1,4}/g)?.join(' ') ?? '';
    this.tarjeta.numero = formatted;
  }

  soloNumeros(event: KeyboardEvent): boolean {
    const charCode = event.charCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  irProducto() {
    this.router.navigate(['/cliente/producto']);
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    const coords = event.latLng;
    if (coords) {
      this.lat = coords.lat();
      this.lng = coords.lng();
      this.center = { lat: this.lat, lng: this.lng };
      this.obtenerDireccionDesdeCoordinatas(this.lat, this.lng);
    }
  }

  onMarkerDragEnd(): void {
    const position = this.marker.getPosition();
    if (position) {
      this.lat = position.lat();
      this.lng = position.lng();
      console.log('Nueva posición del marcador:', this.lat, this.lng);
      this.obtenerDireccionDesdeCoordinatas(this.lat, this.lng);
    }
  }
}