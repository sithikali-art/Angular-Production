import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Attaches the bearer token expected by the .NET Core API
 * ([Authorize] attribute / Azure AD B2C JWT validation).
 * Token acquisition (MSAL etc.) is out of scope for the demo.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('xtrm-access-token');
  if (!token) {
    return next(req);
  }
  return next(
    req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }),
  );
};
