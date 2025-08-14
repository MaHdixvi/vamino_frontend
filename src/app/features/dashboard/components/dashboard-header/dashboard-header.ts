import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/features/auth/services';
import { gsap } from 'gsap';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-header.html',
  styleUrls: ['./dashboard-header.css'],
})
export class DashboardHeaderComponent implements AfterViewInit, OnInit {
  title = 'Dashboard';
  user: any;
  notifications = 5;

  @ViewChild('header') header!: ElementRef<HTMLDivElement>;
  @ViewChild('buttons') buttons!: ElementRef<HTMLDivElement>;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.userProfile$.subscribe((user) => {
      this.user = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }

  ngAfterViewInit(): void {
    gsap.from(this.header.nativeElement, {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });

    gsap.from(Array.from(this.buttons.nativeElement.children), {
      opacity: 0,
      y: 20,
      duration: 0.5,
      delay: 0.5,
      stagger: 0.2,
      ease: 'power2.out',
    });
  }
}
