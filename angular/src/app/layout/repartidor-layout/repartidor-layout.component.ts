import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { AuthService } from '../../cliente/service/auth.service';
import { UserService } from '../../cliente/service/user.service';
import { AlertService } from '../../util/alert.service';

@Component({
  selector: 'app-repartidor-layout',
    imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkWithHref,
    RouterLinkActive
  ],
  templateUrl: './repartidor-layout.component.html',
  styleUrl: './repartidor-layout.component.css'
})
export class RepartidorLayoutComponent {
constructor(private router: Router,
  private authService: AuthService,
      private userService: UserService,
) {}

  cerrarSesion() {
    this.authService.logout();
        this.userService.clearUser();
        this.router.navigate(['/login']);
        AlertService.success('Has cerrado sesión');
  }
}
