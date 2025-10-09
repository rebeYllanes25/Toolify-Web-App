import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VendedorLayoutComponent } from "../layout/vendedor-layout/vendedor-layout.component";
import { InicioComponent } from "./inicio/inicio.component";
import { VentasComponent } from "./ventas/ventas.component";
import { HistorialComponent } from "./historial/historial.component";

const routes: Routes = [
  {
    path: '',
    component: VendedorLayoutComponent,
    children: [
      {
        path: 'inicio',
        component: InicioComponent, 
        data: { title: 'Inicio' }
        
      },
      {
        path: 'ventas',
        component: VentasComponent, 
        data: { title: 'Ventas' }
      },
      {
        path: 'historial',
        component: HistorialComponent, 
        data: { title: 'Historial' }
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendedorRoutingModule {}