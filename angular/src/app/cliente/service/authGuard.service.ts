import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles: string[] = route.data['roles'];
    const userRoles = this.authService.getUserRoles();

    const hasRole = userRoles.some(role => expectedRoles.includes(role));
    if (!hasRole) {
      this.router.navigate(['/login']); // acceso denegado
      return false;
    }
    return true;
  }
}
