// auth/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'authToken';
  private userRolesKey = 'userRoles';
  private userProfileKey = 'userProfile';
  private isLoggedInFlag = false;

  constructor(private http: HttpClient, private router: Router) {
    this.isLoggedInFlag = !!localStorage.getItem(this.tokenKey);
  }

  // Login method
  login(username: string, password: string): void {
    this.http
      .post<{ token: string; roles: string[]; profile: any }>('auth/login', {
        username,
        password,
      })
      .subscribe({
        next: (response) => {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(
            this.userRolesKey,
            JSON.stringify(response.roles)
          );
          localStorage.setItem(
            this.userProfileKey,
            JSON.stringify(response.profile)
          );
          this.isLoggedInFlag = true;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Login failed:', err);
        },
      });
  }

  // Logout method
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userRolesKey);
    localStorage.removeItem(this.userProfileKey);
    this.isLoggedInFlag = false;
    this.router.navigate(['/auth/login']);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    this.isLoggedInFlag = !!token;
    return this.isLoggedInFlag;
  }

  // Get user token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Check if user has a specific role
  hasRole(role: string): boolean {
    const roles = localStorage.getItem(this.userRolesKey);
    if (roles) {
      const userRoles: string[] = JSON.parse(roles);
      return userRoles.includes(role);
    }
    return false;
  }

  // Get user profile
  getUserProfile(): any {
    const profile = localStorage.getItem(this.userProfileKey);
    return profile ? JSON.parse(profile) : null;
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post('/api/register', { username, email, password });
  }
  sendPasswordResetEmail(email: string): Observable<any> {
    return this.http.post('/api/auth/forgot-password', { email });
  }
}
