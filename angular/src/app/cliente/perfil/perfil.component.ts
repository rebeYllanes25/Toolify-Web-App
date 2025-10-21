import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../service/perfil.service';
import { Venta } from '../../shared/model/venta.model';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../shared/model/usuario.model';
import { VentaDTO } from '../../shared/dto/ventaDTO.model';
import { AlertService } from '../../util/alert.service';
import { UsuarioDTO } from '../../shared/dto/usuarioDTO.model';
import { CompraService } from '../service/compra.service';
import { saveAs } from 'file-saver';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service'; // Import AuthService

@Component({
  selector: 'app-perfil',
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  usuario: UsuarioDTO | null = null;
  ventas: VentaDTO[] = [];

  constructor(
    private perfilService: PerfilService,
    private compraService: CompraService,
    private userService: UserService,
    private router: Router,
    private authService: AuthService 
  ) {}

ngOnInit(): void {
  if (!this.authService.isLoggedIn()) {
    console.log('Usuario no logueado. Redirigiendo a login...');
    this.router.navigate(['/login'], { queryParams: { message: 'login_required' } });
    return; 
  }

  const usuario = this.userService.getUser();
  if (!usuario) {
    this.router.navigate(['/login'], { queryParams: { message: 'login_required' } });
    return;
  }

  const idUsuario = usuario.idUsuario;
  this.perfilService.getPerfilCliente(idUsuario).subscribe({
    next: (data: VentaDTO[]) => {
      this.ventas = data;
      if (data.length > 0) {
        this.usuario = data[0].usuario;
      }
    },
    error: (err) => {
      console.error('Error obteniendo ventas:', err);
      if (err.status === 401) {
        this.authService.logout();
        this.router.navigate(['/login'], { queryParams: { message: 'session_expired' } });
      }
    }
  });
}
  descargarPDF(ventaId: number): void {

  const clienteId = this.userService.getUser()?.idUsuario;

  if (!clienteId) {
    AlertService.error('No se pudo encontrar su ID de usuario.');
    return;
  }

  this.compraService.descargarComprobante(clienteId, ventaId).subscribe({
    next: (data: Blob) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      saveAs(blob, `venta_${ventaId}.pdf`);
    },
    error: (err) => {
      console.error('Error al descargar PDF:', err);
      AlertService.error('Error al descargar el PDF. Intente más tarde.');
    }
  });
}
}