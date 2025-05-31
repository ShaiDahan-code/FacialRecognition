import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h2>Create Account</h2>
        
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <div *ngIf="successMessage" class="success-message">
          {{ successMessage }}
        </div>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              type="text" 
              id="username" 
              formControlName="username" 
              class="form-control"
              [ngClass]="{'is-invalid': submitted && f['username'].errors}"
            />
            <div *ngIf="submitted && f['username'].errors" class="invalid-feedback">
              <div *ngIf="f['username'].errors['required']">Username is required</div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email" 
              class="form-control"
              [ngClass]="{'is-invalid': submitted && f['email'].errors}"
            />
            <div *ngIf="submitted && f['email'].errors" class="invalid-feedback">
              <div *ngIf="f['email'].errors['required']">Email is required</div>
              <div *ngIf="f['email'].errors['email']">Email must be a valid email address</div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group half-width">
              <label for="firstName">First Name</label>
              <input 
                type="text" 
                id="firstName" 
                formControlName="firstName" 
                class="form-control"
                [ngClass]="{'is-invalid': submitted && f['firstName'].errors}"
              />
              <div *ngIf="submitted && f['firstName'].errors" class="invalid-feedback">
                <div *ngIf="f['firstName'].errors['required']">First name is required</div>
              </div>
            </div>
            
            <div class="form-group half-width">
              <label for="lastName">Last Name</label>
              <input 
                type="text" 
                id="lastName" 
                formControlName="lastName" 
                class="form-control"
                [ngClass]="{'is-invalid': submitted && f['lastName'].errors}"
              />
              <div *ngIf="submitted && f['lastName'].errors" class="invalid-feedback">
                <div *ngIf="f['lastName'].errors['required']">Last name is required</div>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password" 
              class="form-control"
              [ngClass]="{'is-invalid': submitted && f['password'].errors}"
            />
            <div *ngIf="submitted && f['password'].errors" class="invalid-feedback">
              <div *ngIf="f['password'].errors['required']">Password is required</div>
              <div *ngIf="f['password'].errors['minlength']">Password must be at least 6 characters</div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              formControlName="confirmPassword" 
              class="form-control"
              [ngClass]="{'is-invalid': submitted && f['confirmPassword'].errors}"
            />
            <div *ngIf="submitted && f['confirmPassword'].errors" class="invalid-feedback">
              <div *ngIf="f['confirmPassword'].errors['required']">Confirm Password is required</div>
              <div *ngIf="f['confirmPassword'].errors['mustMatch']">Passwords must match</div>
            </div>
          </div>
          
          <div class="form-group">
            <button 
              type="submit" 
              class="btn btn-primary register-btn"
              [disabled]="loading"
            >
              <span *ngIf="loading" class="spinner-border spinner-border-sm mr-1"></span>
              Register
            </button>
          </div>
          
          <div class="login-link">
            Already have an account? <a routerLink="/auth/login">Login</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 1rem;
    }
    
    .register-card {
      width: 100%;
      max-width: 500px;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    h2 {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    .form-row {
      display: flex;
      gap: 1rem;
    }
    
    .half-width {
      flex: 1;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 1rem;
    }
    
    .register-btn {
      width: 100%;
      padding: 0.75rem;
      background-color: #4285f4;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .register-btn:hover {
      background-color: #3367d6;
    }
    
    .register-btn:disabled {
      background-color: #8eb8ff;
      cursor: not-allowed;
    }
    
    .login-link {
      margin-top: 1rem;
      text-align: center;
    }
    
    .error-message {
      padding: 0.75rem;
      margin-bottom: 1rem;
      background-color: #f8d7da;
      color: #721c24;
      border-radius: 4px;
      text-align: center;
    }
    
    .success-message {
      padding: 0.75rem;
      margin-bottom: 1rem;
      background-color: #d4edda;
      color: #155724;
      border-radius: 4px;
      text-align: center;
    }
    
    .is-invalid {
      border-color: #dc3545;
    }
    
    .invalid-feedback {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    
    @media (max-width: 576px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.mustMatch('password', 'confirmPassword')
    });
  }
  
  // getter for easy access to form fields
  get f() { return this.registerForm.controls; }
  
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
  
  onSubmit() {
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.authService.register({
      username: this.f['username'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      first_name: this.f['firstName'].value,
      last_name: this.f['lastName'].value
    }).subscribe({
      next: () => {
        this.successMessage = 'Registration successful! You can now log in.';
        this.loading = false;
        
        // Redirect to login after a short delay
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: error => {
        this.errorMessage = error.error?.detail || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}