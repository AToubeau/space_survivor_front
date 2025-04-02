import { Routes } from '@angular/router';
import {isUserDisconnectedGuard} from './features/auth/guards/is-user-disconnected-guard';
import {isUserConnectedGuard} from './features/auth/guards/is-user-connected-guard';

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./features/home/pages/home/home.component")
      .then(c => c.HomeComponent),
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
    path:"colonies",
    loadComponent: () => import("./features/planet/pages/colony-list/colony-list.component")
      .then(c => c.ColonyListComponent),
    canActivate:[isUserConnectedGuard]
  },
  {
    path: "colonies/:id",
    loadComponent: () => import("./features/planet/pages/colony-detail/colony-detail.component")
      .then(c => c.ColonyDetailComponent),
    canActivate:[isUserConnectedGuard]
  },
  {
    path: "colonies/:id/ships",
    loadComponent: () => import("./features/ship/components/ship-builder/ship-builder.component")
      .then(c => c.ShipBuilderComponent),
    canActivate:[isUserConnectedGuard]
  }
];
