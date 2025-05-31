import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <a routerLink="/">
              <span class="logo-text">FacialRecognition</span>
            </a>
          </div>
          
          <nav class="main-nav">
            <ul class="nav-list">
              <li *ngIf="authService.isLoggedIn">
                <a routerLink="/events" routerLinkActive="active">Events</a>
              </li>
              <li *ngIf="authService.isLoggedIn">
                <a routerLink="/photos" routerLinkActive="active">Photos</a>
              </li>
              <li *ngIf="authService.isLoggedIn">
                <a routerLink="/people" routerLinkActive="active">People</a>
              </li>
            </ul>
          </nav>
          
          <div class="user-actions">
            <ng-container *ngIf="authService.isLoggedIn; else notLoggedIn">
              <div class="dropdown">
                <button class="user-menu-btn" (click)="toggleDropdown()">
                  <span class="user-name">{{ authService.currentUser?.username }}</span>
                  <span class="dropdown-icon">▼</span>
                </button>
                
                <div class="dropdown-menu" [class.show]="isDropdownOpen">
                  <a routerLink="/profile">My Profile</a>
                  <a routerLink="/profile/settings">Settings</a>
                  <a href="#" (click)="onLogout($event)">Logout</a>
                </div>
              </div>
            </ng-container>
            
            <ng-template #notLoggedIn>
              <a routerLink="/auth/login" class="login-btn">Login</a>
              <a routerLink="/auth/register" class="register-btn">Register</a>
            </ng-template>
          </div>
          
          <button class="mobile-menu-btn" (click)="toggleMobileMenu()">
            <span class="mobile-menu-icon"></span>
          </button>
        </div>
        
        <div class="mobile-nav" [class.show]="isMobileMenuOpen">
          <ul class="mobile-nav-list">
            <li *ngIf="authService.isLoggedIn">
              <a routerLink="/events" routerLinkActive="active">Events</a>
            </li>
            <li *ngIf="authService.isLoggedIn">
              <a routerLink="/photos" routerLinkActive="active">Photos</a>
            </li>
            <li *ngIf="authService.isLoggedIn">
              <a routerLink="/people" routerLinkActive="active">People</a>
            </li>
            <li *ngIf="!authService.isLoggedIn">
              <a routerLink="/auth/login">Login</a>
            </li>
            <li *ngIf="!authService.isLoggedIn">
              <a routerLink="/auth/register">Register</a>
            </li>
            <li *ngIf="authService.isLoggedIn">
              <a routerLink="/profile">My Profile</a>
            </li>
            <li *ngIf="authService.isLoggedIn">
              <a routerLink="/profile/settings">Settings</a>
            </li>
            <li *ngIf="authService.isLoggedIn">
              <a href="#" (click)="onLogout($event)">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 70px;
    }
    
    .logo a {
      text-decoration: none;
      color: #333;
    }
    
    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(90deg, #4285f4, #ea4335);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .main-nav {
      display: flex;
      flex: 1;
      justify-content: center;
    }
    
    .nav-list {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    
    .nav-list li {
      margin: 0 1rem;
    }
    
    .nav-list a {
      text-decoration: none;
      color: #555;
      font-weight: 500;
      padding: 0.5rem 0;
      position: relative;
    }
    
    .nav-list a.active {
      color: #4285f4;
    }
    
    .nav-list a.active:after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #4285f4;
    }
    
    .user-actions {
      display: flex;
      align-items: center;
    }
    
    .login-btn, .register-btn {
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: 500;
    }
    
    .login-btn {
      color: #4285f4;
      margin-right: 1rem;
    }
    
    .register-btn {
      background-color: #4285f4;
      color: white;
    }
    
    .dropdown {
      position: relative;
    }
    
    .user-menu-btn {
      display: flex;
      align-items: center;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      font-size: 1rem;
    }
    
    .user-name {
      margin-right: 0.5rem;
      font-weight: 500;
    }
    
    .dropdown-icon {
      font-size: 0.75rem;
    }
    
    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      min-width: 150px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      display: none;
      z-index: 10;
    }
    
    .dropdown-menu.show {
      display: block;
    }
    
    .dropdown-menu a {
      display: block;
      padding: 0.75rem 1rem;
      text-decoration: none;
      color: #333;
      transition: background-color 0.2s;
    }
    
    .dropdown-menu a:hover {
      background-color: #f5f5f5;
    }
    
    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
    }
    
    .mobile-menu-icon {
      display: block;
      position: relative;
      width: 24px;
      height: 2px;
      background-color: #333;
    }
    
    .mobile-menu-icon:before,
    .mobile-menu-icon:after {
      content: '';
      position: absolute;
      width: 24px;
      height: 2px;
      background-color: #333;
      transition: transform 0.2s;
    }
    
    .mobile-menu-icon:before {
      top: -7px;
    }
    
    .mobile-menu-icon:after {
      bottom: -7px;
    }
    
    .mobile-nav {
      display: none;
      border-top: 1px solid #eee;
    }
    
    .mobile-nav.show {
      display: block;
    }
    
    .mobile-nav-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    
    .mobile-nav-list li {
      border-bottom: 1px solid #eee;
    }
    
    .mobile-nav-list a {
      display: block;
      padding: 1rem;
      text-decoration: none;
      color: #333;
    }
    
    @media (max-width: 768px) {
      .main-nav {
        display: none;
      }
      
      .mobile-menu-btn {
        display: block;
      }
      
      .user-actions {
        margin-right: 1rem;
      }
    }
  `]
})
export class HeaderComponent {
  isDropdownOpen = false;
  isMobileMenuOpen = false;
  
  constructor(public authService: AuthService) {}
  
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  
  onLogout(event: Event) {
    event.preventDefault();
    this.authService.logout();
    window.location.href = '/';
  }
}