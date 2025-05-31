import { Routes } from '@angular/router';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/profile-detail.component').then(m => m.ProfileDetailComponent),
  },
  {
    path: 'edit',
    loadComponent: () => import('./components/profile-edit.component').then(m => m.ProfileEditComponent),
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/profile-settings.component').then(m => m.ProfileSettingsComponent),
  }
];