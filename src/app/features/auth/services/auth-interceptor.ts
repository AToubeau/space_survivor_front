import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {catchError, throwError} from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = JSON.parse(localStorage.getItem('currentUser') || '{}')?.accessToken;

  const cloned = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn('🔐 Token expiré ou invalide, déconnexion en cours...');
        localStorage.removeItem('currentUser');
        window.location.href = '/login'; // ou utilise Router si t'es dans une classe
      }
      return throwError(() => error);
    })
  );
};
