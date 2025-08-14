// core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { User } from '../models/user.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'authToken';
  private isLoggedInFlag = false;

  constructor(private apiService: ApiService, private router: Router) {
    this.isLoggedInFlag = !!localStorage.getItem(this.tokenKey);
  }

  login(username: string, password: string): void {
    this.apiService
      .post<{ token: string }>('auth/login', { username, password })
      .subscribe({
        next: (response) => {
          localStorage.setItem(this.tokenKey, response.token);
          this.isLoggedInFlag = true;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Login failed:', err);
        },
      });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedInFlag = false;
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return this.isLoggedInFlag;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserProfile(): User | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        name: payload.name || '',
        email: payload.email || '',
        phone: payload.phone || '',
        creditScore: payload.creditScore || 0,
        status: payload.status || 'active',
      };
    } catch (e) {
      console.error('Invalid token', e);
      return null;
    }
  }

  validateToken(): boolean {
    return !!this.getToken();
  }

  async updateProfile(profileData: User): Promise<void> {
    try {
      await firstValueFrom(this.apiService.put('auth/profile', profileData));
    } catch (error) {
      console.error('Update profile failed', error);
      throw error;
    }
  }
}
