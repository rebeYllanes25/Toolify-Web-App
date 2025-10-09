import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'cliente',
    loadChildren: () =>
      import('./cliente/cliente.module').then((m) => m.ClienteModule),
  },

  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'vendedor',
    loadChildren: () =>
      import('./vendedor/vendedor.module').then((m) => m.VendedorModule),
  },
  {
    path: 'repartidor',
    loadChildren: () =>
      import('./repartidor/repartidor.module').then((m) => m.RepartidorModule),
  },


  { path: '', redirectTo: 'cliente/index', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' },
];
