
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAdmin = authService.hasRole('admin');

  if (isAdmin) {
    return true; 
  } else {

    console.error('Acceso denegado: Se requiere rol de administrador.');
    router.navigate(['/dashboard']);
    return false; 
  }
};