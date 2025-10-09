import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//ENTORNO DE CONFIGURACION CON DOCKER
import {environment} from '@envs/environment'

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private baseUrl = `${environment.api_URL}/reporte`;

  constructor(private http: HttpClient) {}

  /** ------------------- MENSUAL ------------------- **/

  obtenerTotalVentasMensual(): Observable<number> {
    // GET /reporte/mensual/ventas
    return this.http.get<number>(`${this.baseUrl}/mensual/ventas`);
  }

  obtenerTotalProductosVendidosMensual(): Observable<number> {
    // GET /reporte/mensual/productos
    return this.http.get<number>(`${this.baseUrl}/mensual/productos`);
  }

  obtenerTotalClientesMensual(): Observable<number> {
    // GET /reporte/mensual/clientes
    return this.http.get<number>(`${this.baseUrl}/mensual/clientes`);
  }

  /** ------------------- TOTAL ------------------- **/

  obtenerTotalVentas(): Observable<number> {
    // GET /reporte/total/ventas
    return this.http.get<number>(`${this.baseUrl}/total/ventas`);
  }

  obtenerTotalProductosVendidos(): Observable<number> {
    // GET /reporte/total/productos
    return this.http.get<number>(`${this.baseUrl}/total/productos`);
  }

  obtenerIngresosTotales(): Observable<number> {
    // GET /reporte/total/ingresos
    return this.http.get<number>(`${this.baseUrl}/total/ingresos`);
  }
}
