// src/app/guards/admin.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Llamamos al método que devuelve un booleano directamente
  const isAdmin = authService.hasRole('admin');

  if (isAdmin) {
    return true; // Si es admin, permite el acceso a la ruta
  } else {
    // Si no es admin, puedes redirigirlo a una página de "acceso denegado"
    // o simplemente a su dashboard público.
    console.error('Acceso denegado: Se requiere rol de administrador.');
    router.navigate(['/dashboard']); // Redirigir a la zona de usuario
    return false; // Importante: Bloquear el acceso a la ruta actual
  }
};