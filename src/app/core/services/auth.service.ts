// core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'authToken'; // کلید ذخیره توکن در localStorage
  private userRolesKey = 'userRoles'; // کلید ذخیره نقش‌های کاربر
  private userProfileKey = 'userProfile'; // کلید ذخیره اطلاعات پروفایل کاربر
  private isLoggedInFlag = false; // وضعیت لاگین کاربر

  constructor(private apiService: ApiService, private router: Router) {
    // بررسی وضعیت لاگین هنگام لود شدن سرویس
    this.isLoggedInFlag = !!localStorage.getItem(this.tokenKey);
  }

  /**
   * لاگین کاربر
   * @param username نام کاربری
   * @param password رمز عبور
   */
  login(username: string, password: string): void {
    this.apiService
      .post<{ token: string; roles: string[]; profile: any }>('auth/login', {
        username,
        password,
      })
      .subscribe({
        next: (response) => {
          // ذخیره توکن، نقش‌ها و اطلاعات پروفایل در localStorage
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
          this.router.navigate(['/dashboard']); // هدایت به داشبورد پس از لاگین
        },
        error: (err) => {
          console.error('Login failed:', err);
        },
      });
  }

  /**
   * خروج کاربر
   */
  logout(): void {
    // حذف اطلاعات کاربر از localStorage
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userRolesKey);
    localStorage.removeItem(this.userProfileKey);

    this.isLoggedInFlag = false;
    this.router.navigate(['/auth/login']); // هدایت به صفحه لاگین
  }

  /**
   * بررسی وضعیت لاگین کاربر
   * @returns آیا کاربر لاگین کرده است؟
   */
  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    this.isLoggedInFlag = !!token;
    return this.isLoggedInFlag;
  }

  /**
   * دریافت توکن کاربر
   * @returns توکن کاربر
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * بررسی دسترسی کاربر به نقش خاص
   * @param role نقش مورد نظر
   * @returns آیا کاربر نقش مورد نظر را دارد؟
   */
  hasRole(role: string): boolean {
    const roles = localStorage.getItem(this.userRolesKey);
    if (roles) {
      const userRoles: string[] = JSON.parse(roles);
      return userRoles.includes(role);
    }
    return false;
  }

  /**
   * دریافت اطلاعات پروفایل کاربر
   * @returns اطلاعات پروفایل کاربر
   */
  getUserProfile(): any {
    const profile = localStorage.getItem(this.userProfileKey);
    return profile ? JSON.parse(profile) : null;
  }

  /**
   * بروزرسانی اطلاعات پروفایل کاربر
   * @param profile اطلاعات جدید پروفایل
   */
  updateProfile(profile: any): void {
    localStorage.setItem(this.userProfileKey, JSON.stringify(profile));
  }

  /**
   * اعتبارسنجی توکن (برای API‌هایی که نیاز به اعتبارسنجی دارند)
   * @returns آیا توکن معتبر است؟
   */
  validateToken(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    // در اینجا می‌توانید یک درخواست به API برای اعتبارسنجی توکن ارسال کنید
    // و بر اساس پاسخ، معتبر بودن توکن را بررسی کنید.
    // برای سادگی، فرض می‌کنیم توکن همیشه معتبر است.
    return true;
  }
}
