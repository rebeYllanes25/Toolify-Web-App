import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RepartidorRoutingModule } from "./repartidor-routing.module";
import { RepartidorListadoComponent } from "./listado/repartidor-listado.component";
import { RepartidorLayoutComponent } from "../layout/repartidor-layout/repartidor-layout.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    RepartidorRoutingModule,
    RepartidorListadoComponent,
    RepartidorLayoutComponent
  ]
})

export class RepartidorModule {


}