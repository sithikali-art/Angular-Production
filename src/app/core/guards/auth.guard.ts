import { CanActivateFn } from '@angular/router';

/**
 * Route guard placeholder — in production this validates the Azure AD
 * session before activating protected routes.
 */
export const authGuard: CanActivateFn = () => true;
