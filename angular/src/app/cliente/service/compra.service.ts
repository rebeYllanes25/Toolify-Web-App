import { HttpClient } from '@angular/common/http';
import { Venta } from '../../shared/model/venta.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultadoResponse } from '../../shared/dto/resultadoResponse.model';

//ENTORNO DE CONFIGURACION CON DOCKER
import { environment } from '@envs/environment';

@Injectable({
  providedIn: 'root',
})
export class CompraService {
  private baseUrl = `${environment.api_URL}/venta`;

  constructor(private http: HttpClient) {}

  finalizarVenta(venta: Venta): Observable<ResultadoResponse> {
    return this.http.post<ResultadoResponse>(
      `${this.baseUrl}/finalizar`,
      venta
    );
  }
  descargarComprobante(idCliente: number, idVenta: number): Observable<Blob> {
    const url = `${this.baseUrl}/${idCliente}/pdf/${idVenta}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  guardarVentaDelivery(ventaDelivery: any): Observable<ResultadoResponse> {
    return this.http.post<ResultadoResponse>(
      `${this.baseUrl}/delivery`,
      ventaDelivery
    );
  }

  cancelarVenta(idVenta: number): Observable<ResultadoResponse> {
    return this.http.put<ResultadoResponse>(
      `${this.baseUrl}/${idVenta}/cancelar`,
      null
    );
  }
}