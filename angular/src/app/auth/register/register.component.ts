import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Distrito } from '../../shared/model/distrito.model';
import { AuthService } from '../../cliente/service/auth.service';
import { DistritoService } from '../../admin/service/distrito.service';
import { Router } from '@angular/router';
import { ResultadoResponse } from '../../shared/dto/resultadoResponse.model';
import { AlertService } from '../../util/alert.service';
import { Usuario } from '../../shared/model/usuario.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  distritos: Distrito[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private distritoService: DistritoService,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.cargarDistritos();
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      nombres: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      apePaterno: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      apeMaterno: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      correo: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(50)],
      ],
      clave: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(225),
        ],
      ],
      nroDoc: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      direccion: ['', [Validators.required, Validators.maxLength(50)]],
      idDistrito: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
    });
  }

  cargarDistritos(): void {
    this.distritoService.listaDistrito().subscribe({
      next: (data: Distrito[]) => {
        this.distritos = data;
        console.log('Distritos cargados:', this.distritos);
      },
      error: (error) => {
        console.error('Error al cargar distritos:', error);
        this.errorMessage =
          'Error al cargar los distritos. Por favor, recarga la página.';
      },
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      this.errorMessage = 'Por favor, completa todos los campos correctamente';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.registerForm.value;
    const usuario: Usuario = {
      nombres: formValue.nombres,
      apePaterno: formValue.apePaterno,
      apeMaterno: formValue.apeMaterno,
      correo: formValue.correo,
      clave: formValue.clave,
      nroDocumento: formValue.nroDoc,
      direccion: formValue.direccion,
      telefono: formValue.telefono,
      distrito: {
        idDistrito: parseInt(formValue.idDistrito),
      }
    };

    console.log('Enviando usuario:', usuario);

    this.authService.register(usuario).subscribe({
      next: (resultado: ResultadoResponse) => {
        this.isLoading = false;

        if (resultado.valor) {
          AlertService.success(
            resultado.mensaje || 'Usuario registrado exitosamente'
          );

          this.registerForm.reset();

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          // ⚠️ Error reportado por el backend
          AlertService.error(resultado.mensaje || 'Error al registrar usuario');
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error en registro:', error);

        if (error.status === 400) {
          AlertService.error(
            error.error?.mensaje ||
              'Datos inválidos. Verifica la información ingresada.'
          );
        } else if (error.status === 409) {
          AlertService.error('El correo electrónico ya está registrado.');
        } else if (error.status === 500) {
          AlertService.error(
            'Error del servidor. Intenta nuevamente más tarde.'
          );
        } else {
          AlertService.error(
            error.error?.mensaje ||
              'Error al registrar usuario. Intenta nuevamente.'
          );
        }
      },
    });
  }

  // Marca todos los controles del formulario como tocados
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Verifica si un campo es inválido y ha sido tocado
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Obtiene el mensaje de error apropiado para un campo
  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);

    if (!field) {
      return '';
    }

    if (field.hasError('required')) {
      return 'Este campo es requerido';
    }

    if (field.hasError('email')) {
      return 'Correo electrónico inválido';
    }

    if (field.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }

    if (field.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength'].requiredLength;
      return `Máximo ${maxLength} caracteres`;
    }

    if (field.hasError('pattern')) {
      switch (fieldName) {
        case 'nroDoc':
          return 'Debe tener exactamente 8 dígitos';
        case 'telefono':
          return 'Debe tener exactamente 9 dígitos';
        default:
          return 'Formato inválido';
      }
    }

    return '';
  }

  login(){
    this.router.navigate(['/login']);
  }
}