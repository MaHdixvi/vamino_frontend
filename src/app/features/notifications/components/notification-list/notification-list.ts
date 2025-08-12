import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Notification } from '../../components/notification-item/notification-item';
import { NotificationItemComponent } from '../notification-item/notification-item';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [NotificationItemComponent, CommonModule],
  templateUrl: './notification-list.html',
  styleUrls: ['./notification-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationListComponent implements OnInit {
  notifications$ = new BehaviorSubject<Notification[]>([]);
  loading$ = new BehaviorSubject<boolean>(true);

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading$.next(true);
    this.notificationService.getNotifications().subscribe({
      next: (data: Notification[]) => {
        this.notifications$.next(data);
        this.loading$.next(false);
      },
      error: (err) => {
        console.error('Error loading notifications', err);
        this.loading$.next(false);
      },
    });
  }

  onMarkRead(id: number) {
    this.notificationService.markAsRead(id).subscribe({
      next: () => {
        const current = this.notifications$.getValue();
        const index = current.findIndex((n) => n.id === id);
        if (index > -1) {
          current[index].read = true;
          this.notifications$.next([...current]);
        }
      },
      error: (err) => {
        console.error('Error marking notification as read', err);
      },
    });
  }

  onDelete(id: number) {
    this.notificationService.deleteNotification(id).subscribe({
      next: () => {
        const current = this.notifications$
          .getValue()
          .filter((n) => n.id !== id);
        this.notifications$.next(current);
      },
      error: (err) => {
        console.error('Error deleting notification', err);
      },
    });
  }
}
