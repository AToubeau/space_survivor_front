import { Routes } from '@angular/router';
import {isUserDisconnectedGuard} from './features/auth/guards/is-user-disconnected-guard';
import {isUserConnectedGuard} from './features/auth/guards/is-user-connected-guard';

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./features/home/pages/home/home.component")
      .then(c => c.HomeComponent),
    canActivate:[isUserDisconnectedGuard]
  },
  {
    path: "auth/login",
    loadComponent: () => import("./features/auth/pages/auth-login/auth-login.component")
      .then(c => c.AuthLoginComponent),
    canActivate:[isUserDisconnectedGuard]
  },
  {
    path: "auth/register",
    loadComponent: () => import("./features/auth/pages/auth-register/auth-register.component")
      .then(c => c.AuthRegisterComponent),
    canActivate:[isUserDisconnectedGuard]
  },
  {
    path: "planet",
    loadComponent: () => import("./features/planet/pages/planet-detail/planet-detail.component")
      .then(c => c.PlanetDetailComponent),
    canActivate:[isUserConnectedGuard]
  }
];
