import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

//ENTORNO DE CONFIGURACION CON DOCKER
import { environment } from '@envs/environment';
import { ResultadoResponse } from '../../shared/dto/resultadoResponse.model';
import { Usuario } from '../../shared/model/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.api_URL}/auth/login`;
  private registerUrl = `${environment.api_URL}/auth/register`;
  private userUrl = `${environment.api_URL}/auth/me`;

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    const body = new HttpParams()
      .set('correo', credentials.email)
      .set('clave', credentials.password);

    return this.http.post<{ token: string }>(this.apiUrl, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, // Quita responseType: 'text' para que Angular lo trate como JSON automáticamente
    });
  }

  register(usuario: Usuario): Observable<ResultadoResponse> {
    return this.http.post<ResultadoResponse>(this.registerUrl, usuario, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  getUsuario(): Observable<any> {
    const token = this.getToken();
    if (!token) throw new Error('Token no disponible');

    return this.http.get(this.userUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];
    const decoded: any = jwtDecode(token);
    return decoded.roles || [];
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}