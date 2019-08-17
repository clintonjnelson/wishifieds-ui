import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export class Notification {
  type: string;
  msg: string;
  displayTime: number;
}

// This component only needs to live at the app.component.html level for use by all.
// This component watches the NotificationService for updates & displays them accordingly
// Use by calling notificationService.notify('error', 'my error message!', 6000);
// Error types are: error, warning, info, success

@Injectable()
export class NotificationService {
  display: Notification;
  notifications: Notification[];
  currentlyDisplaying: boolean;
  notifChangeEmit: Subject<Notification> = new Subject<Notification>();

  constructor() {
    this.display             = null;
    this.notifications       = [];
    this.currentlyDisplaying = false;
  }

  // Types are: error, warning, info, success
  // Time is the display time
  notify(type: string, msg: string, displayTime: number = 6000) {
    this.addNotification({type, msg, displayTime});
  }

  private addNotification(newNotif: Notification) {
    this.notifications.unshift(newNotif);
    // If not already displaying, display immediately, else enqueue
    if(!this.currentlyDisplaying) {
      this.displayNotif(this.notifications.pop());
    }
  }

  private displayNotif(notif: Notification) {
    this.display = notif;
    this.notifChangeEmit.next(this.display);
    this.currentlyDisplaying = true;

    const dispTime = (notif.displayTime ? notif.displayTime : 6000);  // may not need eventually
    setTimeout(nextNotifOrEnd.bind(this), dispTime);

    function nextNotifOrEnd() {
      if(this.notifications.length > 0) {
        this.displayNotif(this.notifications.pop());  // pop off end
      }
      else {
        this.display = null;
        this.currentlyDisplaying = false;
        this.notifChangeEmit.next(null);
      }
    }
  }
}
