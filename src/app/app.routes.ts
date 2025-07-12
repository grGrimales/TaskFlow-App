import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard'; // 👈 1. Importa el nuevo guardián


export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [publicGuard] // 👈 2. Aplícalo aquí
  },
  { 
    path: 'register', 
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [publicGuard] // 👈 3. Y aquí también
  },

  { 
    path: 'dashboard', 
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'board/:id', 
    loadComponent: () => import('./pages/board-view/board-view.component').then(m => m.BoardViewComponent),
    canActivate: [authGuard] 
  },

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' } 
];