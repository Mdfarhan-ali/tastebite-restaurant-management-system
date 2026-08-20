import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard = (
  allowedRoles: string[]
): CanActivateFn => {

  return () => {

    const router = inject(Router);

    const userJson = localStorage.getItem('user');

    if (!userJson) {
      return router.createUrlTree(['/auth/login']);
    }

    const user = JSON.parse(userJson);

    if (allowedRoles.includes(user.role)) {
      return true;
    }

    return router.createUrlTree(['/']);
  };
};