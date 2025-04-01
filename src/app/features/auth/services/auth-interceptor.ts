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
        // Redirige vers login si token invalide
        localStorage.removeItem('currentUser');
        window.location.href = '/auth/login';
      }
      return throwError(() => error);
    })
  );
};
