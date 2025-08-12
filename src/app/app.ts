import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Sidebar, Footer, Header } from './shared/components';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Sidebar, Footer, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  currentRoute = '';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });
  }

  isAuthRoute(): boolean {
    return (
      this.currentRoute.includes('auth/login') ||
      this.currentRoute.includes('auth/register') ||
      this.currentRoute.includes('auth/forgot-password')
    );
  }
}
