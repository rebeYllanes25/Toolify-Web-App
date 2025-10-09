import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../../shared/model/categoria.model';
import {environment} from '@envs/environment'
@Injectable({
  providedIn: 'root'
})
export class CategoriaServiceService {
 private url = `${environment.api_URL}/categoria`
  constructor(  private http: HttpClient) { }

  listaCategorias():Observable<Categoria[]>{
     return this.http.get<Categoria[]>(`${this.url}/listaAll`)
  }
}
