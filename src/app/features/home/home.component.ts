import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1>Organize Your Photos with Facial Recognition</h1>
            <p>
              Easily sort, search, and share your event photos with our powerful 
              facial recognition technology. Perfect for weddings, parties, and gatherings.
            </p>
            <div class="hero-buttons">
              <a 
                *ngIf="!authService.isLoggedIn" 
                routerLink="/auth/register" 
                class="btn btn-primary"
              >
                Get Started
              </a>
              <a 
                *ngIf="authService.isLoggedIn" 
                routerLink="/events" 
                class="btn btn-primary"
              >
                My Events
              </a>
              <a href="#how-it-works" class="btn btn-outline">Learn More</a>
            </div>
          </div>
          <div class="hero-image">
            <img src="/assets/images/hero-image.svg" alt="Facial Recognition Technology" />
          </div>
        </div>
      </section>
      
      <section class="features">
        <div class="container">
          <div class="section-header">
            <h2>Features Designed for Event Photos</h2>
            <p>Our platform makes it easy to organize and share event photos</p>
          </div>
          
          <div class="feature-grid">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-face-smile"></i>
              </div>
              <h3>Facial Recognition</h3>
              <p>Automatically identify people across thousands of photos with advanced AI</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-share-nodes"></i>
              </div>
              <h3>Smart Sharing</h3>
              <p>Share photos with guests containing only the images they appear in</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-calendar-days"></i>
              </div>
              <h3>Event Organization</h3>
              <p>Group photos by events to keep everything organized and accessible</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-lock"></i>
              </div>
              <h3>Privacy Protection</h3>
              <p>Control who can access your photos with customizable privacy settings</p>
            </div>
          </div>
        </div>
      </section>
      
      <section id="how-it-works" class="how-it-works">
        <div class="container">
          <div class="section-header">
            <h2>How It Works</h2>
            <p>Get started in just a few simple steps</p>
          </div>
          
          <div class="steps">
            <div class="step-item">
              <div class="step-number">1</div>
              <h3>Upload Your Photos</h3>
              <p>Upload photos from your device or import directly from Google Drive</p>
            </div>
            
            <div class="step-item">
              <div class="step-number">2</div>
              <h3>AI Processing</h3>
              <p>Our system automatically detects and groups faces across all photos</p>
            </div>
            
            <div class="step-item">
              <div class="step-number">3</div>
              <h3>Organize & Share</h3>
              <p>Create personalized links for guests to view and download their photos</p>
            </div>
          </div>
        </div>
      </section>
      
      <section class="pricing">
        <div class="container">
          <div class="section-header">
            <h2>Choose Your Plan</h2>
            <p>Flexible options for every need</p>
          </div>
          
          <div class="pricing-grid">
            <div class="pricing-card">
              <div class="plan-name">Basic</div>
              <div class="plan-price">
                <span class="currency">$</span>
                <span class="amount">9</span>
                <span class="period">/event</span>
              </div>
              <ul class="plan-features">
                <li>Up to 500 photos</li>
                <li>Facial recognition</li>
                <li>7-day access</li>
                <li>Basic sharing</li>
                <li>Email support</li>
              </ul>
              <a routerLink="/auth/register" class="btn btn-outline-primary">Choose Plan</a>
            </div>
            
            <div class="pricing-card featured">
              <div class="plan-badge">Most Popular</div>
              <div class="plan-name">Premium</div>
              <div class="plan-price">
                <span class="currency">$</span>
                <span class="amount">19</span>
                <span class="period">/event</span>
              </div>
              <ul class="plan-features">
                <li>Up to 2,000 photos</li>
                <li>Enhanced recognition</li>
                <li>30-day access</li>
                <li>Advanced sharing</li>
                <li>Priority support</li>
              </ul>
              <a routerLink="/auth/register" class="btn btn-primary">Choose Plan</a>
            </div>
            
            <div class="pricing-card">
              <div class="plan-name">Professional</div>
              <div class="plan-price">
                <span class="currency">$</span>
                <span class="amount">49</span>
                <span class="period">/event</span>
              </div>
              <ul class="plan-features">
                <li>Unlimited photos</li>
                <li>Premium recognition</li>
                <li>Lifetime access</li>
                <li>Custom branding</li>
                <li>24/7 support</li>
              </ul>
              <a routerLink="/auth/register" class="btn btn-outline-primary">Choose Plan</a>
            </div>
          </div>
        </div>
      </section>
      
      <section class="cta">
        <div class="container">
          <div class="cta-content">
            <h2>Ready to Organize Your Event Photos?</h2>
            <p>Get started today and make photo sharing easier than ever</p>
            <a routerLink="/auth/register" class="btn btn-primary btn-lg">Create Your Account</a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      font-family: 'Inter', sans-serif;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .section-header {
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .section-header h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: #333;
    }
    
    .section-header p {
      font-size: 1.25rem;
      color: #666;
      max-width: 600px;
      margin: 0 auto;
    }
    
    /* Hero Section */
    .hero {
      padding: 6rem 0;
      background-color: #f8f9fa;
      overflow: hidden;
    }
    
    .hero .container {
      display: flex;
      align-items: center;
      gap: 2rem;
    }
    
    .hero-content {
      flex: 1;
    }
    
    .hero-content h1 {
      font-size: 3rem;
      line-height: 1.2;
      margin-bottom: 1.5rem;
      color: #333;
    }
    
    .hero-content p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      color: #555;
      max-width: 600px;
    }
    
    .hero-buttons {
      display: flex;
      gap: 1rem;
    }
    
    .hero-image {
      flex: 1;
      display: flex;
      justify-content: center;
    }
    
    .hero-image img {
      max-width: 100%;
      height: auto;
    }
    
    /* Features Section */
    .features {
      padding: 6rem 0;
      background-color: white;
    }
    
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-top: 3rem;
    }
    
    .feature-card {
      padding: 2rem;
      background-color: #f8f9fa;
      border-radius: 8px;
      text-align: center;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.05);
    }
    
    .feature-icon {
      font-size: 2.5rem;
      color: #4285f4;
      margin-bottom: 1.5rem;
    }
    
    .feature-card h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .feature-card p {
      color: #666;
      line-height: 1.6;
    }
    
    /* How It Works */
    .how-it-works {
      padding: 6rem 0;
      background-color: #f8f9fa;
    }
    
    .steps {
      display: flex;
      flex-wrap: wrap;
      gap: 2rem;
      justify-content: center;
      margin-top: 3rem;
    }
    
    .step-item {
      flex: 1;
      min-width: 250px;
      max-width: 350px;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 5px 15px rgba(0,0,0,0.05);
      position: relative;
    }
    
    .step-number {
      width: 50px;
      height: 50px;
      background-color: #4285f4;
      color: white;
      border-radius: 50%;
      font-size: 1.5rem;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }
    
    .step-item h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .step-item p {
      color: #666;
    }
    
    /* Pricing */
    .pricing {
      padding: 6rem 0;
      background-color: white;
    }
    
    .pricing-grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 2rem;
      margin-top: 3rem;
    }
    
    .pricing-card {
      flex: 1;
      min-width: 280px;
      max-width: 350px;
      padding: 3rem 2rem;
      border-radius: 8px;
      background-color: #f8f9fa;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    
    .pricing-card.featured {
      background-color: #fff;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      transform: translateY(-20px);
      border: 2px solid #4285f4;
    }
    
    .plan-badge {
      position: absolute;
      top: 12px;
      right: -30px;
      background-color: #4285f4;
      color: white;
      padding: 0.5rem 2.5rem;
      transform: rotate(45deg);
      font-size: 0.75rem;
      font-weight: bold;
      text-transform: uppercase;
    }
    
    .plan-name {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #333;
    }
    
    .plan-price {
      margin-bottom: 2rem;
    }
    
    .currency {
      font-size: 1.5rem;
      font-weight: 500;
      vertical-align: top;
      margin-right: 0.25rem;
    }
    
    .amount {
      font-size: 3rem;
      font-weight: 700;
      line-height: 1;
    }
    
    .period {
      font-size: 1rem;
      color: #666;
    }
    
    .plan-features {
      margin-bottom: 2rem;
      padding: 0;
      list-style: none;
    }
    
    .plan-features li {
      padding: 0.75rem 0;
      border-bottom: 1px solid #eee;
    }
    
    .plan-features li:last-child {
      border-bottom: none;
    }
    
    /* CTA */
    .cta {
      padding: 6rem 0;
      background: linear-gradient(45deg, #4285f4, #6200ee);
      color: white;
      text-align: center;
    }
    
    .cta h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    
    .cta p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    
    /* Buttons */
    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-weight: 500;
      text-decoration: none;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn-lg {
      padding: 1rem 2rem;
      font-size: 1.125rem;
    }
    
    .btn-primary {
      background-color: #4285f4;
      color: white;
    }
    
    .btn-primary:hover {
      background-color: #3367d6;
    }
    
    .btn-outline {
      background-color: transparent;
      color: #4285f4;
      border: 1px solid #4285f4;
    }
    
    .btn-outline:hover {
      background-color: #4285f4;
      color: white;
    }
    
    .btn-outline-primary {
      background-color: transparent;
      color: #4285f4;
      border: 1px solid #4285f4;
    }
    
    .btn-outline-primary:hover {
      background-color: #4285f4;
      color: white;
    }
    
    @media (max-width: 768px) {
      .hero .container {
        flex-direction: column;
      }
      
      .hero-content {
        text-align: center;
      }
      
      .hero-buttons {
        justify-content: center;
      }
      
      .pricing-card.featured {
        transform: none;
      }
    }
  `]
})
export class HomeComponent {
  constructor(public authService: AuthService) {}
}