import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthTokenModel} from '../models/auth-token.model';
import {AuthCredentialsModel} from '../models/auth-credentials.model';
import {Subject, tap} from 'rxjs';
import {environment} from '@env/environment';
import {ColonyService} from '../../planet/service/colony.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly httpClient: HttpClient = inject(HttpClient);

  private readonly API_URL = environment.apiUrl;

  currentUser: WritableSignal<AuthTokenModel | null> = signal<AuthTokenModel | null>(null);

  userLoggedIn = new Subject<void>

  colonyService: ColonyService = inject(ColonyService);

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
          this.userLoggedIn.next();
        }
      })
    );
  }

  login(credential:AuthCredentialsModel) {
    return this.httpClient.post<AuthTokenModel>('http://localhost:8080/api/auth/login', credential).pipe(
      tap((res: AuthTokenModel | null) => {
        if (res) {
          this.currentUser.set(res);
          console.log("current user", res);
          localStorage.setItem('currentUser', JSON.stringify(res));
          console.log("localStorageUser", localStorage.getItem('currentUser'));
        }
      })
    )
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    this.colonyService.logout();
  }
}
