import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthTokenModel} from '../models/auth-token.model';
import {AuthCredentialsModel} from '../models/auth-credentials.model';
import {tap} from 'rxjs';
import {environment} from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly httpClient: HttpClient = inject(HttpClient);

  private readonly API_URL = environment.apiUrl;

  currentUser: WritableSignal<AuthTokenModel | null> = signal<AuthTokenModel | null>(null);

  constructor() {
    const localStorageUser = localStorage.getItem('currentUser');
    if (localStorageUser) {
      this.currentUser.set(JSON.parse(localStorageUser));
    }
  }

  register(credential:AuthCredentialsModel) {
    return this.httpClient.post<AuthTokenModel>(`${this.API_URL}/auth/register`, credential).pipe(
      tap((res: AuthTokenModel | null) => {
        if (res) {
          this.currentUser.set(res);
          localStorage.setItem('currentUser', JSON.stringify(res));
        }
      })
    );
  }

  login(credential:AuthCredentialsModel) {
    return this.httpClient.post<AuthTokenModel>('http://localhost:8080/api/auth/login', credential).pipe(
      tap((res: AuthTokenModel | null) => {
        if (res) {
          this.currentUser.set(res);
          localStorage.setItem('currentUser', JSON.stringify(res));
        }
      })
    )
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
  }
}
