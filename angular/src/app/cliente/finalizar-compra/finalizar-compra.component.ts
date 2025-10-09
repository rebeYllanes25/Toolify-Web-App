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

@Component({
  selector: 'app-finalizar-compra',
  imports: [CommonModule, FormsModule, GoogleMapsModule],
  templateUrl: './finalizar-compra.component.html',
  styleUrl: './finalizar-compra.component.css',
})
export class FinalizarCompraComponent implements OnInit {
  carrito: DetalleVenta[] = [];
  total: number = 0;
  metodoPago: 'P' | 'R' = 'P';
    zoom = 15;
center: google.maps.LatLngLiteral = { lat: -12.0464, lng: -77.0428 }; // Ubicación inicial
lat: number | null = null;
  lng: number | null = null;

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
  // 1️⃣ Cargar carrito y total
  this.carritoService.getCarritoObservable().subscribe((items) => {
    this.carrito = items;
    this.total = this.carritoService.getTotal();
    
  });

  // 2️⃣ Cargar datos del usuario si está logeado
  if (this.authService.isLoggedIn()) {
    this.authService.getUsuario().subscribe({
      next: (usuario) => {
        if (usuario && usuario.nombres) {
          this.usuario = usuario;

          // 3️⃣ Inicializar centro del mapa con la dirección del usuario
          // Si el usuario tiene lat/lng guardado, úsalo; si no, usa un default
          if (usuario.latitud && usuario.longitud) {
            this.center = { lat: usuario.latitud, lng: usuario.longitud };
            this.lat = usuario.latitud;
            this.lng = usuario.longitud;
          } else {
            this.center = { lat: -12.0464, lng: -77.0428 }; // Lima por defecto
            this.lat = this.center.lat;
            this.lng = this.center.lng;
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
    // Redirigir a login si no hay sesión
    this.router.navigate(['/login'], { queryParams: { message: 'login_required' } });
  }
}


  aumentarCantidad(idProducto: number) {
    try {
      this.carritoService.aumentarCantidad(idProducto);
    } catch (error) {
      // Change alert to a proper AlertService call
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

    if (this.metodoPago === 'R' && (!this.lat || !this.lng)) {
        AlertService.error('Debes seleccionar tu ubicación en el mapa.');
        return;
    }
    
    const tipoVenta = this.metodoPago; 

    const ventaParaBackend: any = {
        idUsuario: this.usuario.idUsuario,
        total: this.total,
        tipoVenta: tipoVenta,
        estado: 'P',
        fechaRegistro: new Date().toISOString(),
        direccionEntrega: tipoVenta === 'R' ? this.usuario.direccion : null,
        latitud: tipoVenta === 'R' ? this.lat : null,
        longitud: tipoVenta === 'R' ? this.lng : null,
        detalles: this.carrito.map(d => ({
            idProducto: d.producto.idProducto,
            cantidad: d.cantidad,
            subTotal: d.subTotal
        }))
    };

    this.compraService.guardarVentaDelivery(ventaParaBackend).subscribe({
        next: response => {
            if (response.valor) {
                AlertService.success(response.mensaje);
                this.carritoService.limpiarCarrito();

                // --- Start of new code ---
                // Get the modal instance and hide it
                const modalElement = document.getElementById('modalPago');
                if (modalElement) {
                    const modal = bootstrap.Modal.getInstance(modalElement);
                    if (modal) {
                        modal.hide();
                    }
                }
                // --- End of new code ---

            } else {
                AlertService.error(response.mensaje);
            }
        },
        error: err => {
            AlertService.error('Error al procesar la compra: ' + err.message);
        }
    });
}
  // En tu FinalizarCompraComponent
abrirModalPago() {
  // Correctly call the function to get its boolean result
  const isLoggedIn = this.authService.isLoggedIn();
  console.log('User is logged in:', isLoggedIn);

  if (isLoggedIn) {
    // If the user is logged in, check if their data is available
    if (this.usuario && this.usuario.nombres) {
      const modal = new bootstrap.Modal(document.getElementById('modalPago')!);
      modal.show();
    } else {
      // If user data is missing, show an alert
      AlertService.error('Tus datos de usuario no están completos. Intenta recargar la página.');
    }
  } else {
    // If the user is NOT logged in, perform the redirection
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
      return true; // números del 0 al 9
    } else {
      event.preventDefault(); // bloquea cualquier otra tecla
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
  }
}

 onMarkerDragEnd(): void {
    const position = this.marker.getPosition();
    if (position) {
      this.lat = position.lat();
      this.lng = position.lng();
      console.log('Nueva posición del marcador:', this.lat, this.lng);
    }
  }
}

