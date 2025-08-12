// app.component.ts
import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Sidebar, Footer, Header } from "./shared/components";
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Sidebar, Footer, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  currentRoute = '';

  constructor(private router: Router) {
    // تشخیص مسیر فعلی
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });
  }

  // بررسی اینکه آیا مسیر فعلی یک صفحه احراز هویت است
  isAuthRoute(): boolean {
    return (
      this.currentRoute.includes('auth/login') ||
      this.currentRoute.includes('auth/register') ||
      this.currentRoute.includes('auth/forgot-password')
    );
  }
}
