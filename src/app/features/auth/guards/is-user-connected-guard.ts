import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';

export const isUserConnectedGuard : CanActivateFn = () => {
  const authService = inject(AuthService);

  return !!authService.currentUser();
}
