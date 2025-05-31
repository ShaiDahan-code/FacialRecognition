import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <h2>FacialRecognition</h2>
            <p>Powerful facial recognition for photo management</p>
          </div>
          
          <div class="footer-links">
            <div class="footer-column">
              <h3>Features</h3>
              <ul>
                <li><a routerLink="/features/facial-recognition">Facial Recognition</a></li>
                <li><a routerLink="/features/photo-sharing">Photo Sharing</a></li>
                <li><a routerLink="/features/events">Event Management</a></li>
                <li><a routerLink="/features/security">Security</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h3>Company</h3>
              <ul>
                <li><a routerLink="/about">About Us</a></li>
                <li><a routerLink="/pricing">Pricing</a></li>
                <li><a routerLink="/contact">Contact</a></li>
                <li><a routerLink="/blog">Blog</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h3>Legal</h3>
              <ul>
                <li><a routerLink="/terms">Terms of Service</a></li>
                <li><a routerLink="/privacy">Privacy Policy</a></li>
                <li><a routerLink="/cookies">Cookie Policy</a></li>
                <li><a routerLink="/gdpr">GDPR Compliance</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <div class="copyright">
            &copy; {{ currentYear }} FacialRecognition. All rights reserved.
          </div>
          
          <div class="social-links">
            <a href="#" target="_blank" aria-label="Facebook">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" target="_blank" aria-label="Twitter">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" target="_blank" aria-label="Instagram">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" target="_blank" aria-label="LinkedIn">
              <i class="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #1a1a2e;
      color: white;
      padding: 4rem 0 2rem;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .footer-content {
      display: flex;
      flex-wrap: wrap;
      gap: 2rem;
      margin-bottom: 3rem;
    }
    
    .footer-brand {
      flex: 1;
      min-width: 200px;
    }
    
    .footer-brand h2 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: white;
      font-size: 1.5rem;
    }
    
    .footer-brand p {
      margin-top: 0;
      color: #a0a0a0;
      max-width: 300px;
    }
    
    .footer-links {
      flex: 2;
      display: flex;
      flex-wrap: wrap;
      gap: 2rem;
    }
    
    .footer-column {
      flex: 1;
      min-width: 150px;
    }
    
    .footer-column h3 {
      font-size: 1rem;
      margin-top: 0;
      margin-bottom: 1.5rem;
      color: white;
      font-weight: 600;
    }
    
    .footer-column ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .footer-column li {
      margin-bottom: 0.5rem;
    }
    
    .footer-column a {
      color: #a0a0a0;
      text-decoration: none;
      transition: color 0.2s;
      font-size: 0.9rem;
    }
    
    .footer-column a:hover {
      color: white;
    }
    
    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 2rem;
    }
    
    .copyright {
      font-size: 0.9rem;
      color: #a0a0a0;
    }
    
    .social-links {
      display: flex;
      gap: 1rem;
    }
    
    .social-links a {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
      transition: background-color 0.2s;
      text-decoration: none;
    }
    
    .social-links a:hover {
      background-color: #4285f4;
    }
    
    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
      }
      
      .footer-bottom {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}