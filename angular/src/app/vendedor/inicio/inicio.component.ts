import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { ReporteService } from '../service/reporte.service';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../cliente/service/auth.service';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkWithHref,
    RouterLinkActive
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})

export class InicioComponent implements OnInit {

  // FECHAS
  fechaCompleta: string = '';
  fechaCorta: string = '';

  correoUsuario: string = ''; 
nombreUsuario: string = ''; 
inicialUsuario: string = ''; 
fotoUsuario: string | ArrayBuffer | null = null;
private usuario: any = null; 

  ventasMensual: number = 0;
  prodsVendidosMensual: number = 0;
  clisAtendidosMensual: number = 0;
  ingresosMensuales: number = 0;

  constructor(private reporteService: ReporteService,private authService: AuthService,private router: Router) { }

  // En tu InicioComponent
ngOnInit(): void {
  if (!this.authService.isLoggedIn()) {
    console.log('Usuario no logueado. Redirigiendo a login...');
    this.router.navigate(['/login'], { queryParams: { message: 'login_required' } });
    return;
  }

  this.obtenerFecha();
  this.cargarDatosUsuario();
  this.cargarDatosMensuales();
}

  obtenerFecha(): void {
    const fecha = new Date();
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    this.fechaCompleta = fecha.toLocaleDateString('es-ES', opciones);
    this.fechaCorta = fecha.toLocaleDateString('es-ES');
  }

  cargarDatosUsuario(): void {
  this.authService.getUsuario().subscribe({
    next: (usuario) => {
      this.usuario = usuario;
      this.correoUsuario = usuario.correo || 'N/A';
      this.nombreUsuario = usuario.nombres || 'N/A';
      this.inicialUsuario = this.nombreUsuario.charAt(0).toUpperCase();

    },
    error: (err) => {
      console.error('Error al cargar datos del usuario:', err);
      if (err.status === 401) {
        this.authService.logout();
        this.router.navigate(['/login'], { queryParams: { message: 'session_expired' } });
      }
    }
  });
}

  subirFoto(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.fotoUsuario = reader.result;
      reader.readAsDataURL(file);
    }
  }

  // Método para cargar todos los datos mensuales
  cargarDatosMensuales(): void {
    forkJoin({
      ventas: this.reporteService.obtenerTotalVentasMensual(),
      productos: this.reporteService.obtenerTotalProductosVendidosMensual(),
      clientes: this.reporteService.obtenerTotalClientesMensual(),
      ingresos: this.reporteService.obtenerIngresosTotales()
    }).subscribe({
      next: resultados => {
        this.ventasMensual = resultados.ventas;
        this.prodsVendidosMensual = resultados.productos;
        this.clisAtendidosMensual = resultados.clientes;
        this.ingresosMensuales = resultados.ingresos;
      },
      error: err => console.error('Error al cargar datos mensuales', err)
    });
  }
}

