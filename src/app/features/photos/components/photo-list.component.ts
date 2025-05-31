import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-photo-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Photos</h2>
      <p>This page will list all photos (placeholder)</p>
    </div>
  `
})
export class PhotoListComponent {}