import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Sidebar, Footer, Header } from './shared/components';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Footer, CommonModule, Header],
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
      this.currentRoute === '/auth/login' ||
      this.currentRoute === '/auth/register'
    );
  }
}
