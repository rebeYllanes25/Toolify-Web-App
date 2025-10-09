import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AdminRoutingModule } from "./admin-routing.module";
import { FormsModule } from '@angular/forms';
import { CrudProveedorComponent } from "./crudProveedor/crudProveedor.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AdminRoutingModule,
    CrudProveedorComponent
  ]
})

export class AdminModule {}