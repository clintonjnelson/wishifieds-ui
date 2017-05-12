import { Component, OnDestroy } from '@angular/core';
import { MdTooltipModule } from '@angular/material';
import { IconService } from '../../core/services/icon.service';
import { AuthService, UserAuth } from '../../core/auth/auth.service';
import { Subscription } from 'rxjs/Subscription';

export class OauthLink {
  icon: string;
  url:  string;
  bgColor: string;
}
export class CustomOauthLink extends OauthLink{
  iconSize: string;
}

const OAUTHS: OauthLink[] = [
  // {icon: 'amazon',            url: '/api/login/amazon',         bgColor: '#ff9900'},  // NO SITE TO LINK TO...
  {icon: 'deviantart',        url: '/api/login/deviantart',     bgColor: '#b3c432'},
  {icon: 'etsy',              url: '/api/login/etsy',           bgColor: '#d15600'},
  {icon: 'facebook',          url: '/api/login/facebook',       bgColor: '#3b5998'},
  {icon: 'foursquare',        url: '/api/login/foursquare',     bgColor: '#0072b1'},
  {icon: 'instagram',         url: '/api/login/instagram',      bgColor: '#675144'},
  {icon: 'linkedin',          url: '/api/login/linkedin',       bgColor: '#4875B4'},
  {icon: 'twitter',           url: '/api/login/twitter',        bgColor: '#00aced'},
  {icon: 'github',            url: '/api/login/github',         bgColor: '#333333'},
  {icon: 'google',            url: '/api/login/google',         bgColor: '#dd4b39'},
  {icon: 'pinterest',         url: '/api/login/pinterest',      bgColor: '#cb2027'},
  {icon: 'reddit',            url: '/api/login/reddit',         bgColor: '#FF5700'},
  {icon: 'spotify',           url: '/api/login/spotify',        bgColor: '#00e461'},
  {icon: 'stack-overflow',    url: '/api/login/stackexchange',  bgColor: '#5184C1'},
  {icon: 'tumblr',            url: '/api/login/tumblr',         bgColor: '#35465c'},
  {icon: 'vimeo',             url: '/api/login/vimeo',          bgColor: '#00bf8f'},
  {icon: 'vk',                url: '/api/login/vkontakte',      bgColor: '#45668e'},
  {icon: 'wordpress',         url: '/api/login/wordpress',      bgColor: '#21759b'},
  {icon: 'youtube',           url: '/api/login/youtube',        bgColor: '#bb0000'},
  {icon: 'disqus',             url: '/api/login/disqus',        bgColor: '#2e9fff'},
  {icon: 'imgur',              url: '/api/login/imgur',         bgColor: '#85bf25'},
  {icon: 'patreon',            url: '/api/login/patreon',       bgColor: '#e6461a'},
];


@Component({
  moduleId: module.id,
  selector: 'signpost-navbar',
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
  showSignpostLoginForm = false;
  showUserNavLinks      = false;
  auth: UserAuth;
  isLoggedIn            = false;
  isLoggedOut           = true;
  username              = '';
  _subscription: Subscription;

  constructor(
    private icons:       IconService,
    public  authService: AuthService ) {
    this.auth          = authService.auth;
    this._subscription = authService.userAuthEmit.subscribe((newVal: UserAuth) => { this.auth = newVal; });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  // Logged OUT Helpers
  toggleShowSignpostLoginForm(input: any = null): void {
    // If setting value directly, do that.
    if(typeof(input) === 'boolean') {
      this.showSignpostLoginForm = input;
    }
    // Else, just toggle the value
    else {
      this.showSignpostLoginForm = !this.showSignpostLoginForm;
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
    if(this.showSignpostLoginForm) {
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
