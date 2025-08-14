import {
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  imports: [FormsModule, CommonModule, RouterModule],
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  name: string = '';
  nationalId: string = '';
  phoneNumber: string = '';
  email: string = '';
  bankAccountNumber: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  @ViewChild('registerBox', { static: true }) registerBox!: ElementRef;
  @ViewChild('titleEl', { static: true }) titleEl!: ElementRef;
  @ViewChildren('formItem') formItems!: QueryList<ElementRef>;

  ngAfterViewInit(): void {
    gsap.from(this.registerBox.nativeElement, {
      duration: 1,
      y: 80,
      opacity: 0,
      ease: 'back.out(1.7)',
    });

    gsap.from(this.titleEl.nativeElement, {
      duration: 0.8,
      opacity: 0,
      y: -30,
      ease: 'power2.out',
      delay: 0.5,
    });

    gsap.from(
      this.formItems.toArray().map((el) => el.nativeElement),
      {
        duration: 0.6,
        opacity: 0,
        y: 20,
        stagger: 0.15,
        ease: 'power2.out',
        delay: 0.7,
      }
    );
  }

  register(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'رمز عبور و تکرار آن یکسان نیست';
      return;
    }

    if (this.name && this.nationalId && this.phoneNumber) {
      const userData = {
        name: this.name,
        nationalId: this.nationalId,
        phoneNumber: this.phoneNumber,
        email: this.email,
        bankAccountNumber: this.bankAccountNumber,
        password: this.password,
      };

      this.authService.register(userData).subscribe({
        next: () => {
          this.router.navigate(['/auth/login']);
        },
        error: (err:any) => {
          this.errorMessage = 'ثبت‌نام ناموفق بود. لطفاً دوباره تلاش کنید.';
          console.error('Registration failed:', err);
        },
      });
    } else {
      this.errorMessage = 'لطفاً تمام فیلدهای الزامی را پر کنید';
    }
  }
}
