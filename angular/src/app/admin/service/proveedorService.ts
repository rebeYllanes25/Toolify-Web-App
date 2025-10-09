import {Injectable }  from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Proveedor } from '../../shared/model/proveedor.model';

//ENTORNO DE CONFIGURACION CON DOCKER
import {environment} from '@envs/environment'
@Injectable({
    providedIn : "root"
})
export class ProveedorService{
    private url = `${environment.api_URL}/proveedor`;
      
    constructor(private http: HttpClient) {}


    listarProveedor():Observable<Proveedor[]>{
        return this.http.get<Proveedor[]>(`${this.url}/index`)
    }
    
    createProveedor(proveedor: Proveedor):Observable<Proveedor>{
        return this.http.post<Proveedor>(`${this.url}/newProveedor`,proveedor)
    }

    actualizarProveedor(id:number,proveedor:Proveedor):Observable<Proveedor>{
        return this.http.put<Proveedor>(`${this.url}/actualizar/${id}`,proveedor)
    }

    detalleProveedor(id:number):Observable<Proveedor>{
        return this.http.get<Proveedor>(`${this.url}/findId/${id}`)
    }

    desactivarProveedor(id:number):Observable<string>{
        return this.http.put(`${this.url}/${id}`, {} , { responseType: 'text' }) as Observable<string>;
    }

    
}