import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Inicio } from './pages/inicio/inicio';
import { Dashboard } from './pages/dashboard/dashboard';
import { Productos } from './pages/productos/productos';
import { Tpv } from './pages/tpv/tpv';
import { Barra } from './pages/barra/barra';
import { Tickets } from './pages/tickets/tickets';
import { Contratar } from './pages/contratar/contratar';

import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Login },
  // ✅ INICIO
  { path: 'inicio', component: Inicio, canActivate: [authGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'productos', component: Productos, canActivate: [authGuard] },
  { path: 'tpv', component: Tpv, canActivate: [authGuard] },
  // ☕ BARRA
  { path: 'barra', component: Barra, canActivate: [authGuard] },
  { path: 'tickets', component: Tickets, canActivate: [authGuard] },
  { path: 'contratar', component: Contratar, canActivate: [authGuard] }
];