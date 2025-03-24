import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {AuthService} from '../../../auth/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    CommonModule,
    NgOptimizedImage,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly authService: AuthService = inject(AuthService);
}
