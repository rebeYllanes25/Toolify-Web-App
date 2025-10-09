import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterLinkWithHref, RouterOutlet,Router } from '@angular/router';
import { AuthService } from '../../cliente/service/auth.service';
import { UserService } from '../../cliente/service/user.service';
import { AlertService } from '../../util/alert.service';

@Component({
  selector: 'app-admin-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkWithHref
],
  templateUrl: './admin-layout.component.html',
styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {

  constructor(
    private authService: AuthService,
        private userService: UserService,
         private router: Router
  ){}
    isReportesOpen: boolean = false;

     toggleReportes(): void {
    this.isReportesOpen = !this.isReportesOpen;
  }

  cerrarMenu(): void {
    this.isReportesOpen = false;
  }
 
 
 logout() {
   this.authService.logout();
       this.userService.clearUser();
       this.router.navigate(['/cliente/index']);
       AlertService.success('Has cerrado sesión');
   }
  

  
}
