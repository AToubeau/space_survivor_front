import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';

export const isUserDisconnectedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  return !authService.currentUser();
};
