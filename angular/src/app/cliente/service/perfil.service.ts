import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta } from '../../shared/model/venta.model';
import { VentaDTO } from '../../shared/dto/ventaDTO.model';

//ENTORNO DE CONFIGURACION CON DOCKER
import {environment} from '@envs/environment'

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private baseUrl = `${environment.api_URL}/cliente`;

  constructor(private http: HttpClient) {}

  getPerfilCliente(idUsuario: number): Observable<VentaDTO[]> {
    return this.http.get<VentaDTO[]>(`${this.baseUrl}/perfil?idUsuario=${idUsuario}`);
  }
}