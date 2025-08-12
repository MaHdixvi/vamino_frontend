import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

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
  templateUrl: './notification-item.html',
  styleUrls: ['./notification-item.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationItemComponent {
  @Input() notification!: Notification;

  @Output() markRead = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  get timeAgo(): string {
    const now = new Date();
    const diff = Math.floor(
      (now.getTime() - this.notification.timestamp.getTime()) / 60000
    );

    if (diff < 1) return 'هم اکنون';
    if (diff < 60) return `${diff} دقیقه پیش`;
    if (diff < 1440) return `${Math.floor(diff / 60)} ساعت پیش`;
    return `${Math.floor(diff / 1440)} روز پیش`;
  }

  onMarkRead(event: MouseEvent) {
    event.stopPropagation();
    if (!this.notification.read) {
      this.markRead.emit(this.notification.id);
    }
  }

  onDelete(event: MouseEvent) {
    event.stopPropagation();
    this.delete.emit(this.notification.id);
  }
}
