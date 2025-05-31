import { Routes } from '@angular/router';

export const PEOPLE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/people-list.component').then(m => m.PeopleListComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./components/person-detail.component').then(m => m.PersonDetailComponent),
  }
];