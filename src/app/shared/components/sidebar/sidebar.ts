import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { Router } from '@angular/router';
import {  gsap } from 'gsap';
import CSSPlugin from 'gsap/src/CSSPlugin';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar implements AfterViewInit {
  menuItems = [
    { label: 'داشبورد', route: '/', icon: 'dashboard' },
    { label: 'درخواست وام', route: '/loans', icon: 'request_quote' },
    { label: 'اعلان‌ها', route: '/notifications', icon: 'notifications' },
    { label: 'پروفایل', route: '/profile', icon: 'person' },
  ];

  @ViewChildren('menuItem') menuItemElements!: QueryList<ElementRef>;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    gsap.registerPlugin(CSSPlugin)
    // انیمیشن ورود با تأخیر برای هر آیتم منو
    gsap.from(this.menuItemElements.toArray(), {
      opacity: 0,
      x: -30,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
