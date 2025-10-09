// src/app/repartidor/repartidor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResultadoResponse } from '../../shared/dto/resultadoResponse.model';

//ENTORNO DE CONFIGURACION CON DOCKER
import {environment} from '@envs/environment'

export interface DetalleVenta {
  idDetalleVenta: number;
  nombreProducto: string;
  cantidad: number;
  subTotal: number;
}

export interface VentaDTO {
  idVenta: number;
  usuario: {
    idUsuario: number;
    nombres: string;
    correo: string;
  };
  fechaRegistro: string;
  total: number;
  estado: string;
  tipoVenta: string;
  detalles: DetalleVenta[];
  direccionEntrega: string;
  latitud: number;
  longitud: number;
  direccionLegible: string;
}

export interface DetalleVentaDTO {
  idProducto: number;
  nombreProducto: string;
  cantidad: number;
  subTotal: number;
}

export interface VentaDeliveryDTO {
  idVenta: number; 
  idUsuario: number;
  total: number;
  direccionEntrega: string;
  latitud: number;
  longitud: number;
  detalles: DetalleVentaDTO[];
}

export interface VentaListadoDTO {
  idVenta: number;
  cliente: string;            
  fechaRegistro: string;
  total: number;
  estado: string;
  tipoVenta: string;
  detalles: DetalleVentaListadoDTO[];  
  direccionLegible: string;            
}

export interface DetalleVentaListadoDTO {
  nombreProducto: string;
  cantidad: number;
  subTotal: number;
}



@Injectable({
  providedIn: 'root'
})
export class RepartidorService {

  private baseUrl =  `${environment.api_URL}/repartidor`;

  constructor(private http: HttpClient) { }

  obtenerPedidosDeliveryPendientes(): Observable<VentaDTO[]> {
    return this.http.get<VentaDTO[]>(`${this.baseUrl}/pedidos`);
  }

  actualizarEstadoPedido(idVenta: number, estado: string): Observable<ResultadoResponse> {
  return this.http.patch<ResultadoResponse>(`${this.baseUrl}/estado/${idVenta}`, { estado });
}

  marcarPedidoComoEntregado(idVenta: number): Observable<string> {
  return this.http.put(`${this.baseUrl}/marcar-entregado/${idVenta}`, null, {
    responseType: 'text' 
  });
}



}
