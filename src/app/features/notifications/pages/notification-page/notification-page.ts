import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { NotificationListComponent } from '../../components/notification-list/notification-list';
import { gsap } from 'gsap';

@Component({
  selector: 'app-notification-page',
  standalone: true,
  imports: [NotificationListComponent],
  templateUrl: './notification-page.html',
  styleUrls: ['./notification-page.css'],
})
export class NotificationPage implements AfterViewInit {
  @ViewChild('pageContainer', { static: true }) pageContainer!: ElementRef;

  ngAfterViewInit() {
    const container = this.pageContainer.nativeElement;

    // انیمیشن عنوان
    gsap.from(container.querySelector('h1'), {
      y: -20,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
    });

    // انیمیشن آیتم‌های اعلان‌ها
    gsap.from(container.querySelectorAll('app-notification-item'), {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      delay: 0.5,
      ease: 'power2.out',
    });
  }
}
