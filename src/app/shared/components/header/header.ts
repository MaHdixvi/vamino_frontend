import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/features/auth/services/auth.service';
import { gsap } from 'gsap';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [CommonModule],
  styleUrls: ['./header.css'],
})
export class Header implements OnInit, AfterViewInit {
  @ViewChild('logo') logoEl!: ElementRef;
  @ViewChild('userInfo') userInfoEl!: ElementRef;

  userProfile: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userProfile = this.authService.getUserProfile();
    console.log('User Profile:', this.userProfile);
  }

  ngAfterViewInit(): void {
    gsap.from(this.logoEl.nativeElement, {
      opacity: 0,
      x: -50,
      duration: 1,
      ease: 'power3.out',
    });

    // بررسی وجود userInfo قبل از انیمیشن
    if (this.userInfoEl) {
      gsap.from(this.userInfoEl.nativeElement, {
        opacity: 0,
        x: 50,
        duration: 1,
        ease: 'power3.out',
        delay: 0.3,
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.userProfile = null;
    this.router.navigate(['/auth/login']);
  }
}
