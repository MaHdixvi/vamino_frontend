// notifications/components/notification-item/notification-item.ts
import { Component, Input } from '@angular/core';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [],
  templateUrl: './notification-item.html',
  styleUrls: ['./notification-item.css'],
})
export class NotificationItemComponent {
  @Input() notification!: Notification;

  // Returns a human-readable time string (e.g., "5 دقیقه پیش")
  get timeAgo(): string {
    const now = new Date();
    const diff = Math.floor(
      (now.getTime() - this.notification.timestamp.getTime()) / 60000
    ); // Difference in minutes

    if (diff < 1) return 'هم اکنون';
    if (diff < 60) return `${diff} دقیقه پیش`;
    if (diff < 1440) return `${Math.floor(diff / 60)} ساعت پیش`;
    return `${Math.floor(diff / 1440)} روز پیش`;
  }
}
