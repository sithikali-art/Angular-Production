import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Normalizes ProblemDetails / ApiResponse error payloads coming back
 * from ASP.NET Core into a single Error shape the UI can display.
 */
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const detail =
        err.error?.message ?? err.error?.title ?? err.message ?? 'Unexpected API error';
      return throwError(() => new Error(`[${err.status}] ${detail}`));
    }),
  );
