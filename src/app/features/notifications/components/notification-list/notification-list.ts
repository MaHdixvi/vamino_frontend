// notifications/components/notification-list/notification-list.ts
import { Component, OnInit } from '@angular/core';
import { Notification } from '../../components';
import { NotificationItemComponent } from '../notification-item';
import { NotificationService } from '../../services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [NotificationItemComponent,CommonModule],
  templateUrl: './notification-list.html',
  styleUrls: ['./notification-list.css'],
})
export class NotificationListComponent implements OnInit {
  notifications: Notification[] = [];
  loading = true;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (data:any) => {
        this.notifications = data;
        this.loading = false;
      },
      error: (err:any) => {
        console.error('Error loading notifications', err);
        this.loading = false;
      },
    });
  }

  markAsRead(notification: Notification): void {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          notification.read = true;
        },
        error: (err) => {
          console.error('Error marking notification as read', err);
        },
      });
    }
  }

  deleteNotification(id: number): void {
    this.notificationService.deleteNotification(id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter((n) => n.id !== id);
      },
      error: (err:any) => {
        console.error('Error deleting notification', err);
      },
    });
  }
}
