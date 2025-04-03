import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink, RouterModule} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-auth-login',
  template: `
    <div class="flex h-screen items-center justify-center bg-gray-900 text-white">
      <div class="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-center mb-4">Connexion</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="space-y-4">
          <input
            type="text"
            formControlName="username"
            placeholder="Nom d'utilisateur"
            class="w-full p-2 bg-gray-700 border border-gray-600 rounded"
          />
          <input
            type="password"
            formControlName="password"
            placeholder="Mot de passe"
            class="w-full p-2 bg-gray-700 border border-gray-600 rounded"
          />
          <button
            type="submit"
            class="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold"
            [disabled]="!loginForm.valid"
          >Se connecter
          </button>
          <p *ngIf="loginError" class="text-red-500">{{ loginError }}</p>
        </form>
        <p class="text-sm text-center mt-4">
          Pas encore inscrit ? <a routerLink="/register" class="text-blue-400 hover:underline">Créer un compte</a>
        </p>
      </div>
    </div>
  `,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    RouterModule
  ]
})
export class AuthLoginComponent {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);

  loginForm: FormGroup;
  loginError: string | null = null;

  constructor() {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required, Validators.minLength(5)]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    })
  }

  onLogin() {

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        if (res) {
          this.router.navigate(['/colonies']);
        }else {
          this.router.navigate(['/']);
        }

      },
      error: (err: any)=> {
        this.loginError = "invalid username or password";
        console.log("error : ", err);
      }
    })
  }
}
