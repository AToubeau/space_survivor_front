import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';

export const isUserConnectedGuard : CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router)

  if (authService.currentUser()) {
    router.navigate(['/planet']);
    return false;
  }
  return true;
}
