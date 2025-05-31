import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-people-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>People</h2>
      <p>This page will list all people detected in photos (placeholder)</p>
    </div>
  `
})
export class PeopleListComponent {}