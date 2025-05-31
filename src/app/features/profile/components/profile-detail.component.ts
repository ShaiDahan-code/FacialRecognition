import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Profile</h2>
      <p>This page will show user profile (placeholder)</p>
    </div>
  `
})
export class ProfileDetailComponent {}