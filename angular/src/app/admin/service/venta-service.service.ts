import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VentaFiltroFechaTipoUsuario } from '../../../app/shared/dto/VentaFiltroFechaTipoUsuario.model';
import { VentaPorFechasDTO } from '../../shared/dto/VentaPorFechasDTO.model';
import { VentaPorTipoVentaMesDTO } from '../../shared/dto/ventaPorTipoVentaMesDTO.model';
import { VentaPorDistrito } from '../../shared/dto/ventaPorDistrito.model';

//ENTORNO DE CONFIGURACION CON DOCKER
import {environment} from '@envs/environment'
import { RMVentaPedidoDTO } from '../../shared/dto/RMVentaPedidoDTO.model';

@Injectable({
  providedIn: 'root'
})
export class VentaServiceService {
private url = `${environment.api_URL}/venta`;
private url2 = `${environment.api_URL}/pedido`;
  constructor(
      private http: HttpClient
  ) { }


  ListadoVentaFechaAndTipoVenta(
    fechaInicio:string | null,
    fechaFin:string | null,
    tipoVenta?:string):Observable<VentaFiltroFechaTipoUsuario[]>
  {
    let urlBase =  `${this.url}/filtradoVentas`
    if(fechaInicio!=null && fechaFin!=null){
      
      urlBase+=`/${fechaInicio}&${fechaFin}`;
    }
    if(tipoVenta){
    urlBase+=`?tipoVenta=${tipoVenta}`
    }
    return this.http.get<VentaFiltroFechaTipoUsuario[]>(urlBase);
  }
  
//listado para LOS GRAFICOS
  listadoDeVentasPorMes():Observable<VentaPorFechasDTO[]>{
    return this.http.get<VentaPorFechasDTO[]>(`${this.url}/ListaMes`)
  } 

  listadoVentaPorTipoVentaMes():Observable<VentaPorTipoVentaMesDTO[]>{
    return this.http.get<VentaPorTipoVentaMesDTO[]>(`${this.url}/listoVentaTipo`)
  }

  listadoVentaPorDistrito():Observable<VentaPorDistrito[]>{
    return this.http.get<VentaPorDistrito[]>(`${this.url}/listadoVentaMes`)
  }

  listadoRMVentaYPedidos():Observable<RMVentaPedidoDTO[]>{
    return this.http.get<RMVentaPedidoDTO[]>(`${this.url2}/resumen/mensual/VYP`)
  }

}
