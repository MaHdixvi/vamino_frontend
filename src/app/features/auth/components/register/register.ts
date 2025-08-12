// auth/components/register/register.component.ts
import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';


@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  imports:[FormsModule,CommonModule, RouterModule],
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  email: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}
  @ViewChild('registerBox', { static: true }) registerBox!: ElementRef;
  @ViewChild('titleEl', { static: true }) titleEl!: ElementRef;
  @ViewChildren('formItem') formItems!: QueryList<ElementRef>;

  ngAfterViewInit(): void {
    // انیمیشن ورود جعبه اصلی
    gsap.from(this.registerBox.nativeElement, {
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
  // Method to handle registration form submission
  register(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.username && this.password && this.email) {
      this.authService
        .register(this.username, this.email, this.password)
        .subscribe({
          next: () => {
            // Redirect to the login page or dashboard on successful registration
            this.router.navigate(['/auth/login']);
          },
          error: (err) => {
            this.errorMessage = 'Registration failed. Please try again.';
            console.error('Registration failed:', err);
          },
        });
    } else {
      this.errorMessage = 'Please fill in all fields';
    }
  }
}
