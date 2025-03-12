import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-auth-register',
  template: `
    <div class="flex h-screen items-center justify-center bg-gray-900 text-white">
      <div class="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-center mb-4">Inscription</h2>
        <form [formGroup]="registerForm" (ngSubmit)="onRegister()" class="space-y-4">
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
            class="w-full p-2 bg-green-600 hover:bg-green-700 rounded font-semibold"
            [disabled]="registerForm.invalid"
          >Créer un compte
          </button>
        </form>
        <p class="text-sm text-center mt-4">
          Déjà un compte ? <a routerLink="/login" class="text-blue-400 hover:underline">Se connecter</a>
        </p>
      </div>
    </div>
  `,
  imports: [
    ReactiveFormsModule
  ]
})
export class AuthRegisterComponent {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);

  registerForm: FormGroup;
  loginError: string | null = null;

  constructor() {
    this.registerForm = this.formBuilder.group({
      username: [null, [Validators.required, Validators.maxLength(5)]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    })
  }
  onRegister() {
    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        console.log(this.registerForm.value);
        this.router.navigate(['/planet']);
      },
      error: (err: any)=> {
        this.loginError = "invalid username or password";
        console.log("error : ", err);
      }
    })
  }
}
