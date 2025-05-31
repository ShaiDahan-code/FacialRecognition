import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-photo-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Photo Details</h2>
      <p>This page will show photo details (placeholder)</p>
    </div>
  `
})
export class PhotoDetailComponent {}