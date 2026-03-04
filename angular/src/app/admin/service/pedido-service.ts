import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@envs/environment';
import { PedidoDTO } from '../../shared/dto/pedidoDTO.model';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private url = `${environment.api_URL}/repartidor`;

  constructor(private http: HttpClient) {}

  listarPedidosPendientes(): Observable<PedidoDTO[]> {
    return this.http.get<PedidoDTO[]>(`${this.url}/pendientes`);
  }

  actualizarEstadoPedido(
    idPedido: number,
    estado: string = 'AS'
  ): Observable<any> {
    return this.http.put<any>(
      `${this.url}/${idPedido}/estado?estado=${estado}`,
      {}
    );
  }
}
