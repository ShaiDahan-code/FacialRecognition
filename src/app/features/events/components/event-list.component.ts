import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Events</h2>
      <p>This page will list all events (placeholder)</p>
    </div>
  `
})
export class EventListComponent {}