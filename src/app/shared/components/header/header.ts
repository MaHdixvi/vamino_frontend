import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/services/auth.service';
import { gsap } from 'gsap';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements AfterViewInit {
  @ViewChild('logo') logoEl!: ElementRef;
  @ViewChild('userInfo') userInfoEl!: ElementRef;

  constructor(private authService: AuthService, private router: Router) {}

  ngAfterViewInit(): void {
    // انیمیشن لوگو و اطلاعات کاربر به صورت جداگانه با تاخیر
    gsap.from(this.logoEl.nativeElement, {
      opacity: 0,
      x: -50,
      duration: 1,
      ease: 'power3.out',
    });
    gsap.from(this.userInfoEl.nativeElement, {
      opacity: 0,
      x: 50,
      duration: 1,
      ease: 'power3.out',
      delay: 0.3,
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
  get userProfile() {
    return this.authService.getUserProfile();
  }
}
