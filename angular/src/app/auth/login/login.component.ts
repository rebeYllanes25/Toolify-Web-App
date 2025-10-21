import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../cliente/service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../util/alert.service';
import { UserService } from '../../cliente/service/user.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  errorMessage: string = '';
ngOnInit(): void {
    // Subscribe to query parameters
    this.route.queryParams.subscribe(params => {
      // Check if the 'loginAlert' parameter exists and has a value of 'true'
      if (params['message'] === 'login_required') {
        // Display the info alert with your desired message
        AlertService.info('Debes iniciar sesión para acceder a esta función.');

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { loginAlert: null },
          queryParamsHandling: 'merge' // Merge with any other existing query params
        });
      }
    });
  }
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          const token = response.token;
          this.authService.saveToken(token);
          console.log('Token guardado:', token);

          // Ahora obtener los datos del usuario
          this.authService.getUsuario().subscribe({
            next: (usuario) => {
              console.log('Usuario completo:', usuario);
              this.userService.setUser(usuario);

              const rol = usuario.rol;
              console.log('Rol:', rol);
              const rolDescripcion = usuario.rol.descripcion;
              console.log('Rol descripción:', rolDescripcion);
              AlertService.success(`¡Bienvenido, ${usuario.nombres}!`);
              switch (rolDescripcion) {
                case 'A':
                  this.router.navigate(['/admin/crudProducto']);
                  break;
                case 'C':
                  this.router.navigate(['/cliente/index']);
                  break;
                case 'R':
                  this.router.navigate(['/repartidor/inicio']);
                  break;
                case 'V':
                  this.router.navigate(['/vendedor/inicio']);
                  break;
                default:
                  this.router.navigate(['/login']);
              }
            },
            error: (err) => {
              console.error('Error al obtener usuario:', err);
              this.errorMessage = 'Error al cargar usuario';
            },
          });
        },
        error: (err) => {
          this.errorMessage = 'Credenciales incorrectas';
          console.error(err);
        },
      });
    }
  }
}
