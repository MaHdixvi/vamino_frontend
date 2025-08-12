import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/services';
import { gsap } from 'gsap';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.html',
  imports:[CommonModule],
  styleUrls: ['./dashboard-header.css'],
})
export class DashboardHeaderComponent implements AfterViewInit {
  title: string = 'Dashboard';
  user: string = 'John Doe';
  notifications: number = 5;

  @ViewChild('header') header!: ElementRef<HTMLDivElement>;
  @ViewChild('buttons') buttons!: ElementRef<HTMLDivElement>;

  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
  }

  ngAfterViewInit(): void {
    // انیمیشن ورود هدر
    gsap.from(this.header.nativeElement, {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });

    // انیمیشن دکمه‌ها و متن‌ها با تاخیر پله‌ای
    gsap.from(this.buttons.nativeElement.children, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      delay: 0.5,
      stagger: 0.2,
      ease: 'power2.out',
    });
  }
}
