import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink, RouterModule} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {CommonModule} from '@angular/common';
import {ColonyContextService} from '../../../colony/service/colony-context.service';
import {ColonyService} from '../../../colony/service/colony.service';

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
          <div *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched" class="text-red-500 text-sm">
            <div *ngIf="registerForm.get('username')?.errors?.['required']">Ce champ est requis</div>
            <div *ngIf="registerForm.get('username')?.errors?.['minlength']">Minimum 5 caractères</div>
          </div>
          <input
            type="password"
            formControlName="password"
            placeholder="Mot de passe"
            class="w-full p-2 bg-gray-700 border border-gray-600 rounded"
          />
          <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="text-red-500 text-sm">
            <div *ngIf="registerForm.get('password')?.errors?.['required']">Ce champ est requis</div>
            <div *ngIf="registerForm.get('password')?.errors?.['minlength']">Minimum 6 caractères</div>
          </div>
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
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    RouterModule
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
      username: [null, [Validators.required, Validators.minLength(5)]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    })
  }

  onRegister() {
    console.log("Button clicked !");
    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        if (res) {
          this.router.navigate(['/colonies']); // 👈 cohérent avec login
        } else {
          this.loginError = "Une erreur est survenue lors de l'inscription.";
        }
      },
      error: (err: any) => {
        this.loginError = "Nom d'utilisateur déjà utilisé ou mot de passe invalide";
        console.log("error : ", err);
      }
    });
  }
}
