import { Component } from '@angular/core';
import { NotificationItemComponent, NotificationListComponent } from "../../components";

@Component({
  selector: 'app-notification-page',
  imports: [ NotificationListComponent],
  templateUrl: './notification-page.html',
  styleUrl: './notification-page.css',
})
export class NotificationPage {
  // This component is primarily a container for the NotificationListComponent.
  // It may contain additional logic in the future, such as page-level navigation or title management.
}
