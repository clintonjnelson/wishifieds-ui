import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from './notification.service';
import { AuthService } from '../auth/auth.service';

// This is a component, so that we can route to it...
// BUT this is NOT really a component, it's a service that redirects the user
// It holds logic on how to redirect the view for each error case,
//   and can show notifications accordingly.

@Component({template: ''})

export class ErrorRedirectComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private notification: NotificationService,
              private authService: AuthService) {}

  ngOnInit() {
    let error = this.route.snapshot.params['error'];  // get the error type
    switch (error) {
      case 'oauthsign': {
        this.notification.notify('error', 'Oops, that sign broke during creation... please try again.')
        this.router.navigate(['/', this.authService.auth.username]);
        break;
      }
      case 'oauthlogin': {
        this.notification.notify('warning', 'That didn\'t quite work - please try again!')
        this.router.navigate(['/']);
        break;
      }
      default: this.router.navigate(['/']);
    }
  }
}
