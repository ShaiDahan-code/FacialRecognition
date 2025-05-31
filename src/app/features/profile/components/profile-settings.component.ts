import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Settings</h2>
      <p>This page will allow managing user settings (placeholder)</p>
    </div>
  `
})
export class ProfileSettingsComponent {}