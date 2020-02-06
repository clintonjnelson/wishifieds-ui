import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../auth/auth.service';

// This is a component, so that we can route to it...
// BUT this is NOT really a component, it's a service that redirects the user
// It holds logic on how to redirect the view for each error case,
//   and can show notifications accordingly.

@Component({template: ''})
export class OauthRedirectComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private notification: NotificationService,
              private authService: AuthService) {}

  ngOnInit() {
    const redirectType = this.route.snapshot.params['redirecttype'];  // get the error type; this comes from app-routing.module.ts route param naming

    console.log("REDIRECT TYPE PARAM IS: ", redirectType);

    switch (redirectType) {
      // Success case
      case 'oauthsuccess': {
        const queryParams = this.route.snapshot.queryParams;
        console.log("PARAMS IS: ", queryParams);
        const eatToken = queryParams['token'];
        const username = queryParams['username'];
        const role =     queryParams['role'];
        const email =    queryParams['email'];
        const userId =   queryParams['userId'];
        const profilePicUrl = queryParams['profilePicUrl'];
        console.log('EAT TOKEN QUERY PARAM IS: ', eatToken);
        console.log('username QUERY PARAM IS: ', username);
        console.log('role QUERY PARAM IS: ', role);
        console.log('email QUERY PARAM IS: ', email);
        console.log('userId QUERY PARAM IS: ', userId);
        console.log('profilePicUrl QUERY PARAM IS: ', profilePicUrl);
        this.authService.setAuthCookies(eatToken, username, userId, email, role, profilePicUrl);
        this.router.navigate(['/', username]);
        break;
      }

      // Error cases
      case 'oauthsignerror': {
        this.notification.notify('error', 'Oops, that sign broke during creation... please try again.');
        this.router.navigate(['/', this.authService.auth.username]);
        break;
      }
      case 'oauthloginerror': {
        this.notification.notify('warning', 'That didn\'t quite work - please try again!');
        this.router.navigate(['/']);
        break;
      }
      case 'oautherror': {
        this.notification.notify('warning', 'That didn\'t quite work - please try again!');
        this.router.navigate(['/']);
        break;
      }
      case 'reset': {
        this.notification.notify('warning', 'Sorry, your session expired. Please login and try again!', 8000);
        this.authService.logout();   // deletes cookies, reset auth values, redirect home
      }
      default: this.router.navigate(['/']);
    }
  }
}
