import { Component, OnDestroy } from '@angular/core';
import { MatTooltipModule } from '@angular/material';
import { IconService } from '../../core/services/icon.service';
import { AuthService, UserAuth } from '../../core/auth/auth.service';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';
import { GAEventService } from '../../core/services/ga-event.service';

export class OauthLink {
  icon: string;
  url:  string;
  bgColor: string;
}
export class CustomOauthLink extends OauthLink{
  iconSize: string;
}

const OAUTHS: OauthLink[] = [];


@Component({
  moduleId: module.id,
  selector: 'main-navbar',
  templateUrl: 'navbar.component.html',  // trigger: [@visibilityChanged]='showLoginLinks'
  styleUrls:  ['navbar.component.css'],
  // animations: [trigger('visibilityChanged', [
  // state('false', style({opacity: 0, transform: 'translateX(0)'})),
  // state('true',  style({opacity: 1, transform: 'translateX(0)'})),
  // transition('false => true', [style({opacity: 0, transform: 'translateX(100px)' }), animate('2000ms')]),  // between wildcard states
  // transition('true => false', [animate('2000ms', style({opacity: 0, transform: 'translateX(-100px)'}))])  // between wildcard states
  // ])
  // ]
})

export class NavbarComponent implements OnDestroy {
  oauthLinks = OAUTHS;
  showLoginLinks        = false;
  showLoginForm = false;
  showUserNavLinks      = false;
  auth: UserAuth;
  isLoggedIn            = false;
  isLoggedOut           = true;
  _subscription: Subscription;

  constructor(
              private icons:         IconService,
              private authService:   AuthService,
              private notifications: NotificationService,
              public  gaEvent:       GAEventService) {
    this.auth          = authService.auth;
    this._subscription = authService.userAuthEmit.subscribe((newVal: UserAuth) => {
      this.auth = newVal;  // Track & Update these
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  gaClick(label: string) {
    this.gaEvent.emitEvent('navbar', 'click', label);
  }

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  // Logged OUT Helpers
  toggleShowSignpostLoginForm(input: any = null): void {
    // Trigger GA tracking
    this.gaClick('loginsignupexpand');

    // If setting value directly, do that.
    if(typeof(input) === 'boolean') {
      this.showLoginForm = input;
    }
    // Else, just toggle the value
    else {
      this.showLoginForm = !this.showLoginForm;
    }
  }

  toggleShowLoginLinks(input: any = null): void {
    // If setting value directly, do that.
    if(typeof(input) === 'boolean') {
      this.showLoginLinks = input;
    }
    // Else, just toggle the value
    else {
      this.showLoginLinks = !this.showLoginLinks;
    }
    if(this.showLoginForm) {
      this.toggleShowSignpostLoginForm(false);
    }
  }

  onCloseLogin(event: any) {
    this.toggleShowSignpostLoginForm();
  }

  // Logged IN Helpers
  toggleShowUserNavLinks(input: any = null) {
    // If setting value directly, do that.
    if(typeof(input) === 'boolean') {
      this.showUserNavLinks = input;
    }
    // Else, just toggle the value
    else {
      this.showUserNavLinks = !this.showUserNavLinks;
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
