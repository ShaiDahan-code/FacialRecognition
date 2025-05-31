import { Routes } from '@angular/router';

export const EVENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/event-list.component').then(m => m.EventListComponent),
  },
  {
    path: 'new',
    loadComponent: () => import('./components/event-create.component').then(m => m.EventCreateComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./components/event-detail.component').then(m => m.EventDetailComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./components/event-edit.component').then(m => m.EventEditComponent),
  }
];