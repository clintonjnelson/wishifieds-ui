import { Component } from '@angular/core';
import { NotificationService, Notification } from '../core/services/notification.service';
import { Subscription } from 'rxjs/Subscription';

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
  // notifs: Notification[];
  notification: Notification;
  _subscription: Subscription;  // Current notification subscription

  constructor(private notifService: NotificationService) {
    this.notification  = notifService.display;
    this._subscription = notifService.notifChangeEmit.subscribe((newNotif: Notification) => { this.notification = newNotif });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
