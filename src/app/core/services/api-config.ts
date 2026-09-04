import { InjectionToken } from '@angular/core';

/**
 * Base URL of the C# .NET Core API hosted on Azure.
 * Overridden per environment in app.config.ts.
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => 'https://api.xtrm-demo.azurewebsites.net/api/v1',
});

/**
 * Demo flag — when true, API services resolve from local mock data
 * instead of hitting the network, so the UI runs standalone.
 */
export const USE_MOCK_API = new InjectionToken<boolean>('USE_MOCK_API', {
  providedIn: 'root',
  factory: () => true,
});
