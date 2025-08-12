import { Component, ElementRef, Inject, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';


@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule,CommonModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
email: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    @Inject(AuthService) private authService: AuthService,
    private router: Router
  ) {}

  @ViewChild('forgotBox', { static: true }) forgotBox!: ElementRef;
  @ViewChild('titleEl', { static: true }) titleEl!: ElementRef;
  @ViewChildren('formItem') formItems!: QueryList<ElementRef>;

  ngAfterViewInit(): void {
    // انیمیشن ورود جعبه اصلی
    gsap.from(this.forgotBox.nativeElement, {
      duration: 1,
      y: 80,
      opacity: 0,
      ease: 'back.out(1.7)',
    });

    // انیمیشن عنوان
    gsap.from(this.titleEl.nativeElement, {
      duration: 0.8,
      opacity: 0,
      y: -30,
      ease: 'power2.out',
      delay: 0.5,
    });

    // انیمیشن آیتم‌های فرم
    gsap.from(this.formItems.toArray().map((el) => el.nativeElement), {
      duration: 0.6,
      opacity: 0,
      y: 20,
      stagger: 0.15,
      ease: 'power2.out',
      delay: 0.7,
    });
  }

  // متد ارسال ایمیل بازیابی رمز
  resetPassword(): void {
    if (this.email) {
      this.authService.sendPasswordResetEmail(this.email).subscribe({
        next: () => {
          this.successMessage = 'Password reset instructions have been sent to your email.';
          this.errorMessage = '';
        },
        error: (err) => {
          this.errorMessage = 'Failed to send password reset email. Please try again.';
          this.successMessage = '';
          console.error('Password reset error:', err);
        },
      });
    } else {
      this.errorMessage = 'Please enter your email address';
      this.successMessage = '';
    }
  }
}
