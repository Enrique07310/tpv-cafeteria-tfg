import { CanActivateFn, Router } from '@angular/router';

import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  const token = localStorage.getItem('token');

  // ❌ SIN TOKEN
  if (!token) {

    router.navigate(['/']);

    return false;

  }

  // ✅ LEER ROL DEL JWT
  const payload =
    JSON.parse(atob(token.split('.')[1]));

  const rol = payload.rol;

  const url = state.url;

  // ✅ BLOQUEAR RUTAS ADMIN
  if (
    rol === 'Empleado' &&
    (
      url.includes('/dashboard') ||
      url.includes('/productos') ||
      url.includes('/contratar')
    )
  ) {

    router.navigate(['/tpv']);

    return false;

  }

  return true;

};