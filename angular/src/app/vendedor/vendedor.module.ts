import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { VendedorRoutingModule } from "./vendedor-routing.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    VendedorRoutingModule
  ]
})

export class VendedorModule {}