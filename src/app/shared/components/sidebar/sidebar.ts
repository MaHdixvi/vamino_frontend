// app/components/sidebar/sidebar.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar {
  menuItems = [
    { label: 'داشبورد', route: '/', icon: 'dashboard' },
    { label: 'درخواست وام', route: '/loans', icon: 'loan' },
    { label: 'اعلان‌ها', route: '/notifications', icon: 'notifications' },
    { label: 'پروفایل', route: '/profile', icon: 'profile' },
  ];

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
