import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private userUrl = `${environment.apiUrl}/users`;
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {
    this.loadUser();
  }
  
  private loadUser(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.getUserProfile().subscribe();
    }
  }
  
  public get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
  
  public get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  
  public get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    // Send JSON directly instead of form data
    return this.http.post<AuthResponse>(`${this.apiUrl}/token`, loginRequest)
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.access_token);
          this.getUserProfile().subscribe();
        })
      );
  }
  
  register(registerRequest: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registerRequest);
  }
  
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }
  
  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.userUrl}/me`)
      .pipe(
        tap(user => this.currentUserSubject.next(user))
      );
  }
  
  updatePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.userUrl}/me/password`, {
      current_password: currentPassword,
      new_password: newPassword
    });
  }
}