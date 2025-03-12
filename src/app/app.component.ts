import {Component, computed, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AuthService} from './features/auth/services/auth.service';
import {NavbarComponent} from './layout/navbar/navbar.component';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'space_survivor_front';
  private readonly authService = inject(AuthService);
  isLoggedIn = computed(() => this.authService.currentUser() !== null);
}
