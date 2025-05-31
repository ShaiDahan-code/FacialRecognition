import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Event Details</h2>
      <p>This page will show event details (placeholder)</p>
    </div>
  `
})
export class EventDetailComponent {}