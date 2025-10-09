import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { AuthService } from '../../cliente/service/auth.service';
import { UserService } from '../../cliente/service/user.service';
import { AlertService } from '../../util/alert.service';

@Component({
  selector: 'app-vendedor-layout',
    imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkWithHref,
    RouterLinkActive
  ],
  templateUrl: './vendedor-layout.component.html',
  styleUrl: './vendedor-layout.component.css'
})
export class VendedorLayoutComponent {
  constructor(    
    private authService: AuthService,
    private userService: UserService,
    private router: Router){
      

    }
  logout() {
  this.authService.logout();
      this.userService.clearUser();
      this.router.navigate(['/cliente/index']);
      AlertService.success('Has cerrado sesión');
  }
}
