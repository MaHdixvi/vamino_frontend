import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TokenService } from './token.service';

interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  message: string;
  errors?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  creditScore?: number;
  status?: string;
  role?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInFlag = false;
  private userProfileSubject = new BehaviorSubject<UserProfile>({
    id: '',
    name: '',
    creditScore:0,
    email: '',
    phone: '',
    role: null,
    status: undefined,
  });
  userProfile$ = this.userProfileSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.isLoggedInFlag = !!this.tokenService.getToken();
    if (this.isLoggedInFlag) {
      this.loadUserProfile().subscribe();
    }
  }

  login(username: string, password: string): void {
    this.http
      .post<ApiResponse<string>>(`${environment.apiUrl}/Auth/login`, {
        username,
        password,
      })
      .subscribe({
        next: (res) => {
          if (res.isSuccess && res.data) {
            this.tokenService.saveToken(res.data);
            this.isLoggedInFlag = true;
            this.loadUserProfile().subscribe(() => {
              this.router.navigate(['/']);
            });
          } else {
            console.error('Login failed:', res.message);
          }
        },
        error: (err) => console.error('Login error:', err),
      });
  }

  logout(): void {
    this.tokenService.removeToken();
    this.isLoggedInFlag = false;
    this.userProfileSubject.next({
      id: '',
      name: '',
      email: '',
      phone: '',
      role: null,
      status: undefined,
    });
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    const token = this.tokenService.getToken();
    this.isLoggedInFlag = !!token && !this.tokenService.isTokenExpired();
    return this.isLoggedInFlag;
  }

  getToken(): string | null {
    return this.tokenService.getToken();
  }

  getUserProfile(): Observable<UserProfile | null> {
    return this.userProfile$;
  }

  updateProfile(profileData: Partial<UserProfile>): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/Auth/update-profile`,
      profileData
    );
  }

  register(userData: {
    name: string;
    nationalId: string;
    phoneNumber: string;
    password: string;
    email?: string;
    bankAccountNumber?: string;
  }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Auth/register`, userData);
  }

  sendPasswordResetEmail(email: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Auth/forgot-password`, {
      email,
    });
  }

  private getUserIdFromToken(): string | null {
    const decoded: any = this.tokenService.decodeToken();
    return decoded
      ? decoded[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ] || null
      : null;
  }

  private loadUserProfile(): Observable<UserProfile | null> {
    const userId = this.getUserIdFromToken();
    if (!userId) return of(null);

    return this.http
      .get<UserProfile>(`${environment.apiUrl}/Users/${userId}`)
      .pipe(
        map((user) => {
          this.userProfileSubject.next(user);
          return user;
        }),
        catchError((err) => {
          console.error('Error loading user profile:', err);
          this.userProfileSubject.next({
            id: '',
            name: '',
            email: '',
            phone: '',
            creditScore: 0,
            status: '',
            role: null,
          });
          return of(null);
        })
      );
  }
}
