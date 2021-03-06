import { Component, OnDestroy } from '@angular/core';
import { NotificationService, Notification } from '../core/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  moduleId: module.id,
  selector: 'notifications',
  templateUrl: 'notifications.component.html',
  styleUrls:  ['notifications.component.css']
})

// This component only needs to live at the app.component.html level for use by all.
// This component watches the NotificationService for updates & displays them accordingly
// Use by calling notificationService.notify('error', 'my error message!', 6000);
// Error types are: error, warning, info, success

export class NotificationsComponent implements OnDestroy {
  // notifs: Notification[];
  notification: Notification;
  notificationSub: Subscription;  // Current notification subscription

  constructor(private notifService: NotificationService) {
    this.notification  = notifService.display;
    this.notificationSub = notifService.notifChangeEmit.subscribe((newNotif: Notification) => {
      console.log("NOTIFICATION CHANGED. RECEIVED: ", newNotif);
      this.notification = newNotif;
    });
  }

  ngOnDestroy() {
    this.notificationSub.unsubscribe();
  }
}
