import { Component } from '@angular/core';
import { NotificationService, Notification } from '../core/services/notification.service';


@Component({
  moduleId: module.id,
  selector: 'notifications',
  templateUrl: 'notifications.component.html',
  styleUrls:  ['notifications.component.css']
})

// This component watches the NotificationService for updates & displays them accordingly
// Use by calling notificationService.notify('error', 'my error message!', 6000);
// Error types are: error, warning, info, success

export class NotificationsComponent {
  notifs: Notification[];
  constructor(private notifService: NotificationService) {}
}
