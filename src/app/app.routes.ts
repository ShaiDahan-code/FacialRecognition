import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AUTH_ROUTES } from './features/auth/auth.routes';

export const routes: Routes = [
  {
    path: 'auth',
    children: AUTH_ROUTES
  },
  {
    path: 'photos',
    loadChildren: () => import('./features/photos/photos.routes').then(mod => mod.PHOTOS_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'events',
    loadChildren: () => import('./features/events/events.routes').then(mod => mod.EVENTS_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'people',
    loadChildren: () => import('./features/people/people.routes').then(mod => mod.PEOPLE_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.routes').then(mod => mod.PROFILE_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(mod => mod.HomeComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];