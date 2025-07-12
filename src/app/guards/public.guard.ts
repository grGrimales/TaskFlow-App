// src/app/guards/public.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, tap } from 'rxjs/operators';

export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    // El operador 'map' invierte el resultado.
    // Queremos permitir el acceso a la ruta solo si el usuario NO está autenticado.
    map(isAuth => !isAuth), 
    tap(isNotAuth => {
      // Si 'isNotAuth' es 'false', significa que el usuario SÍ está autenticado.
      if (!isNotAuth) {
        // Por lo tanto, lo redirigimos al dashboard.
        router.navigate(['/dashboard']);
      }
    })
  );
};