// auth/services/token.service.ts
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode'; 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private tokenKey = 'authToken';

  constructor() {}

  // Save token to localStorage
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Decode JWT token
  decodeToken(): any {
    const token = this.getToken();
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    const decodedToken = this.decodeToken();
    if (decodedToken && decodedToken.exp) {
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    }
    return true;
  }

  // Remove token from localStorage
  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
