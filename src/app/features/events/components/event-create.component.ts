import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Create Event</h2>
      <p>This page will allow creation of events (placeholder)</p>
    </div>
  `
})
export class EventCreateComponent {}