import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-photo-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Upload Photos</h2>
      <p>This page will allow uploading photos (placeholder)</p>
    </div>
  `
})
export class PhotoUploadComponent {}