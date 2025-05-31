import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-person-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Person Details</h2>
      <p>This page will show details for a specific person (placeholder)</p>
    </div>
  `
})
export class PersonDetailComponent {}