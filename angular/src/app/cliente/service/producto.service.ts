import { Injectable } from '@angular/core';
import { HttpClient,  HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../../shared/model/producto.model';
import { Categoria } from '../../shared/model/categoria.model';
import { ProductoFilter } from '../../shared/dto/productofilter.model';
import { Page } from '../../shared/dto/page.model';

//ENTORNO DE CONFIGURACION CON DOCKER
import {environment} from '@envs/environment'

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private baseClienteUrl = `${environment.api_URL}/cliente`;
  private productoPath = 'producto';

  constructor(private http: HttpClient) {}

  getProductosYCategorias(
  filter?: ProductoFilter,
  page: number = 0,
  size: number = 12,
  order?: 'asc' | 'desc'
): Observable<{ productos: Page<Producto>, categorias: Categoria[] }> {
  let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());

  if (order) {
    params = params.set('order', order);
  }

  if (filter?.idCategorias && filter.idCategorias.length > 0) {
    filter.idCategorias.forEach(id => {
      params = params.append('idCategorias', id.toString());
    });
  }

  const url = `${this.baseClienteUrl}/${this.productoPath}`;
  return this.http.get<{ productos: Page<Producto>, categorias: Categoria[] }>(url, { params });
}


}
