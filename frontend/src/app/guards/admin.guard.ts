import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AppComponent } from '../app';

export const adminGuard: CanActivateFn = () => {
  const appMain = inject(AppComponent);
  const router = inject(Router);

  console.log('Verificando acceso Admin:', appMain.isAdmin); // Para debugear en la consola

  if (appMain.isAdmin) {
    return true;
  } else {
    console.warn('Acceso denegado. No eres Admin.');
    router.navigate(['/catalogo']);
    return false;
  }
};