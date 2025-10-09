import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AdminLayoutComponent } from "../layout/admin-layout/admin-layout.component";

//COMPONENTES PROVEEDOR
import { CrudProveedorComponent } from "./crudProveedor/crudProveedor.component";
import { CreateProveedorComponent } from "./crudProveedor/create/create.component";
import { EditProveedorComponent } from "./crudProveedor/edit/edit.component";

//COMPONENTS PRODUCTOS
import { ListaProductosComponent } from "./crudProducto/lista-productos/lista-productos.component";
import { CreateProductoComponent } from "./crudProducto/create-producto/create-producto.component";
import { EditProductoComponent } from "./crudProducto/edit-producto/edit-producto.component";
import { ReporteStockComponent } from "./reportes/reporte-stock/reporte-stock.component";
import { ReporteVentaComponent } from "./reportes/reporte-venta/reporte-venta.component";

const routes: Routes = [
{
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Dashboard' },
      },  
      {
        path : 'crudProveedor',
        children : [
              {path: '', component: CrudProveedorComponent}, //listar
              {path: 'create', component: CreateProveedorComponent}, //crear
              {path: 'edit/:id', component: EditProveedorComponent}
        ]
      },
      {
        path: 'crudProducto',
        children : [
            {path :'', component : ListaProductosComponent},
            {path: 'createProducto' , component : CreateProductoComponent},
            {path: 'editProducto/:id' , component : EditProductoComponent}
          
        ]
      },
      {
        path: 'reportes',
        children : [
            {path :'reporteStock', component : ReporteStockComponent},
            {path :'reporteVenta', component : ReporteVentaComponent},
          
        ]
      }
    

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}