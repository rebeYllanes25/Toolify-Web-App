import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ClienteRoutingModule } from "./cliente-routing.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ClienteRoutingModule
  ]
})

export class ClienteModule {}