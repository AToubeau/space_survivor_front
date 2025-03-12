import {Component, inject} from '@angular/core';
import {AuthService} from '../../features/auth/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  template: `
    <nav class="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 class="text-xl font-bold">Space Survivor</h1>
      <div>
        <button (click)="logout()" class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Déconnexion</button>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);

  logout() {
    this.authService.logout()
    this.router.navigate(['/']);
  }
}
