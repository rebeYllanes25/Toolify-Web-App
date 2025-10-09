import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ClienteRoutingModule } from '../cliente/cliente-routing.module';
import { AuthGuard } from '../cliente/service/authGuard.service';
import { DashboardComponent } from '../admin/dashboard/dashboard.component';
import { AppComponent } from '../app.component';
import { RepartidorInicioComponent } from '../repartidor/inicio/repartidor-inicio.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: 'Iniciar sesión' } },
  { path: 'register', component: RegisterComponent, data: { title: 'Registrate' } },
  { path: 'cliente/index', 
    component: ClienteRoutingModule,
    canActivate: [AuthGuard],
    data: {roles: ['C']}
  },
  {path: 'admin/dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {roles: ['A']}  
  },
  {
    path: 'vendedor', 
    component: AppComponent,
    canActivate: [AuthGuard],
    data: {roles: ['V']}
  },
  {
    path: 'reparidor/inicio',
    component: RepartidorInicioComponent,
    canActivate: [AuthGuard],
    data: {roles: ['R']}
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}