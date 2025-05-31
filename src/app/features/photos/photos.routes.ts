import { Routes } from '@angular/router';

export const PHOTOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/photo-list.component').then(m => m.PhotoListComponent),
  },
  {
    path: 'upload',
    loadComponent: () => import('./components/photo-upload.component').then(m => m.PhotoUploadComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./components/photo-detail.component').then(m => m.PhotoDetailComponent),
  }
];