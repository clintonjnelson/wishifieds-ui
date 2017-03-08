import { Component, OnInit } from '@angular/core';
import { NotificationService, Notification } from '../core/services/notification.service';

const NOTIFS: Notification[] = [
  {type: 'error',   msg: 'oops, that wasnt supposed to happen', displayTime: 1500},
  {type: 'warning', msg: 'hey, you probably shouldnt do that',  displayTime: 1500},
  {type: 'info',    msg: 'there are a couple of options here',  displayTime: 1500},
  {type: 'success', msg: 'yeah, that worked out really well',   displayTime: 1500}
];

@Component({
  moduleId: module.id,
  selector: 'notifications',
  templateUrl: 'notifications.component.html',
  styleUrls:  ['notifications.component.css']
})

// This component watches the NotificationService for updates & displays them accordingly
export class NotificationsComponent implements OnInit {
  notifs: Notification[];
  constructor(private notifService: NotificationService) {
    this.notifs = NOTIFS;
  }

  ngOnInit() {
    this.notifs.forEach(notif => {
      this.notifService.notify(notif.type, notif.msg, notif.displayTime);
    });
  }
}
