import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiUsersService } from '../api/api-users.service';
import { NotificationService } from '../services/notification.service';

@Component({template: ''})

export class UserConfirmationRedirectComponent implements OnInit {
  constructor( private route:          ActivatedRoute,
               private router:         Router,
               private apiUsersService: ApiUsersService,
               private notifications:  NotificationService,) {}

  ngOnInit() {
    const that = this;
    const token  = this.route.snapshot.queryParams['confirmationtoken'];
    const email  = this.route.snapshot.queryParams['email'];

    this.apiUsersService.confirmUser(token, email)
      .subscribe(
        success => {
          console.log("SUCCESS IN CONFIRM CALL SAYS: ", success);
          const username = success.username;
          that.notifications.notify('success', 'Your email has been confirmed. Welcome!', 10000);
          that.router.navigate([username]);
        },
        error => {
          console.log("ERROR IN CONFIRM CALL IS: ", error);
          that.notifications.notify('error',
            'Confirmation was unsuccessful. ' +
            'Please try again or have us send you another confirmation email (request that in your user settings).'
          );
          that.router.navigate(['/']);
        });
  }
}
