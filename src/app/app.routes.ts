import { Routes } from '@angular/router';

import { MainLayoutComponent } from './layout/main-layout.component';

/** Stub routes share one lazy component and get their title from route data. */
const stub = (path: string, title: string) => ({
  path,
  loadComponent: () =>
    import('./features/placeholder/placeholder-page.component').then(
      (m) => m.PlaceholderPageComponent,
    ),
  data: { title },
  title: `${title} · Xtrm`,
});

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./company/home/home.component').then((m) => m.HomeComponent),
        title: 'Home · Xtrm',
      },
      {
        path: 'wallets',
        loadComponent: () =>
          import('./features/wallets/wallets.component').then((m) => m.WalletsComponent),
        title: 'Wallets · Xtrm',
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile.component').then((m) => m.ProfileComponent),
        title: 'User Profile · Xtrm',
      },

      // Fund group (Image 2 — sidebar accordion)
      stub('fund/wallet', 'Fund Wallet'),
      stub('fund/options', 'Funding Options'),

      // Pay group
      stub('pay/simple', 'Simple Pay'),
      stub('pay/advanced', 'Advanced Pay'),
      stub('pay/mass', 'Mass Pay'),
      stub('pay/api', 'API Payments'),
      stub('pay/bills', 'Bill Pay'),

      stub('move', 'Move'),
      stub('transfer', 'Transfer'),
      stub('exchange', 'Exchange'),
      stub('requests', 'Requests'),
      stub('activity', 'Activity'),
      stub('analytics', 'Analytics'),
      stub('reports', 'Reports'),
      stub('contacts', 'Contacts'),
      {
        path: 'settings',
        loadComponent: () =>
          import('./company/settings/settings.component').then((m) => m.SettingsComponent),
        title: 'Organization · Xtrm',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
