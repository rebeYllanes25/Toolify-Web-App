import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RepartidorLayoutComponent } from "../layout/repartidor-layout/repartidor-layout.component";
import { RepartidorListadoComponent } from "./listado/repartidor-listado.component";
import { RepartidorInicioComponent } from "./inicio/repartidor-inicio.component";

const routes: Routes = [
{
  path:'',
  component:RepartidorLayoutComponent,
  children:[
    { path: 'inicio', component: RepartidorInicioComponent},
    { path: 'pedidos', component: RepartidorListadoComponent },
    {path: '', redirectTo: 'inicio', pathMatch: 'full'}
  ],
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RepartidorRoutingModule {}