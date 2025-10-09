import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteLayoutComponent } from '../layout/cliente-layout/cliente-layout.component';
import { ProductoComponent } from './producto/producto.component';
import { IndexComponent } from './index/index.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { ContactoComponent } from './contacto/contacto.component';
import { FinalizarCompraComponent } from './finalizar-compra/finalizar-compra.component';
import { PerfilComponent } from './perfil/perfil.component';

const routes: Routes = [
  {
    path: '',
    component: ClienteLayoutComponent,
    children: [
      {
        path: 'index', 
        component: IndexComponent,data: { title: 'Index' }
      },
      {
        path: 'producto',
        component: ProductoComponent,data: { title: 'Productos' }
      },
      {
        path: 'nosotros',
        component: NosotrosComponent,data: { title: 'Nosotros' }
      },
      {
        path: 'contacto',
        component: ContactoComponent,data: { title: 'Contacto' }
      },
      {
        path: 'finalizarCompra',
        component: FinalizarCompraComponent,data: { title: 'Finalizar-Compra' }
      },
      {
        path:'perfil',
        component: PerfilComponent, data:{title:'Perfil'}
      }
    ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClienteRoutingModule {}
