import { Component, ElementRef, Inject, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // For navigation after login
import { AuthService } from '../../services/auth.service'; // Example service for authentication
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports:[FormsModule,CommonModule, RouterModule],
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  username: string = ''; // To store the username input
  password: string = ''; // To store the password input
  errorMessage: string = ''; // To display error messages

  constructor(
    @Inject(AuthService) private authService: AuthService,
    private router: Router
  ) {}

  @ViewChild('loginBox', { static: true }) loginBox!: ElementRef;
  @ViewChild('titleEl', { static: true }) titleEl!: ElementRef;
  @ViewChildren('formItem') formItems!: QueryList<ElementRef>;

  ngAfterViewInit(): void {
    // انیمیشن ورود جعبه اصلی
    gsap.from(this.loginBox.nativeElement, {
      duration: 1,
      y: 80,
      opacity: 0,
      ease: 'back.out(1.7)'
    });

    // انیمیشن عنوان
    gsap.from(this.titleEl.nativeElement, {
      duration: 0.8,
      opacity: 0,
      y: -30,
      ease: 'power2.out',
      delay: 0.5
    });

    // انیمیشن آیتم‌های فرم
    gsap.from(this.formItems.toArray().map(el => el.nativeElement), {
      duration: 0.6,
      opacity: 0,
      y: 20,
      stagger: 0.15,
      ease: 'power2.out',
      delay: 0.7
    });
  }
  // Method to handle login form submission
  login(): void {
    if (this.username && this.password) {
      this.authService.login(this.username, this.password)
    } else {
      this.errorMessage = 'Please enter both username and password';
    }
  }
}
