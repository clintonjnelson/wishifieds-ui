import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NavigationEnd, Router, UrlSerializer } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService, UserAuth } from '../core/auth/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { MatTooltipModule } from '@angular/material';
import { IconService } from '../core/services/icon.service';
import { Subscription } from 'rxjs/Subscription';
import { SignpostApi } from '../core/api/signpost-api.service';
import { GAEventService } from '../core/services/ga-event.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
declare let ga: Function;

export class NavLink {
  icon:    string;
  url:     string;
  bgColor: string;
};

const SOCIAL_LINKS: NavLink[] = [
  {icon: 'facebook', url: '',  bgColor: '#3b5998'},
  {icon: 'twitter',  url: '',  bgColor: '#007bb5'},
  {icon: 'google',   url: '',  bgColor: '#dd4b39'},
];

@Component({
  moduleId: module.id,
  selector: 'signpost-footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.css'],
})

export class FooterComponent implements OnDestroy {
  @ViewChild('clipboardUrlEl') clipboardUrlEl: ElementRef;
  auth: UserAuth;
  userHomeUrl: string;
  authSubscription: Subscription;
  urlSubscription:  Subscription;
  currentUrl:       string;
  currentUsername:  any;
  showSharingLinks   = false;
  socialSharingLinks = SOCIAL_LINKS;

  constructor(private icons:         IconService,
              private router:        Router,
              private location:      Location,
              private urlSerializer: UrlSerializer,
              private authService:   AuthService,
              private notifications: NotificationService,
              private signpostApi:   SignpostApi,
              private gaEvent:       GAEventService) {

    // Initialize user's clipboard copy link
    this.auth = authService.auth;
    this.updateUserHomeUrl();

    // Maintain user's home clipboard copy link
    this.authSubscription = authService.userAuthEmit.subscribe((newVal: UserAuth) => {
      this.auth = newVal;
      this.updateUserHomeUrl();
    });

    // Set Initial values for social sharing
    this.updateCurrentUrl();
    this.rebuildSocialSharingLinks();

    // HACKY, but currently the only way to get the username outside of a router-outlet
    // Set currentUrl & try to get currentUsername
    this.urlSubscription = router.events.subscribe( event => {

      // Update links on change
      this.updateCurrentUrl();
      this.rebuildSocialSharingLinks();

      // Username? => set it if there is one
      if(event instanceof NavigationEnd) {
        // Set GoogleAnalytics Tracking for page-changes
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');

        console.log("URL AFTER REDIRECTS VALUE IS: ", event.urlAfterRedirects);
        const currentUrlTree = this.router.parseUrl(this.router.url);
        // console.log("CURRENT URL TREE IS: ", currentUrlTree);
        try {
          this.currentUsername = currentUrlTree.root.children['primary']['segments'][0]['path'];
        }
        catch (e) {
          this.currentUsername = '';
        }
      }
    });
  }

  ngOnDestroy() {
    this.urlSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  toggleShowSharingLinks(input: any = null): void {
    if(typeof(input) === 'boolean') { this.showSharingLinks = input; }
    else { this.showSharingLinks = !this.showSharingLinks; }
    console.log("SHARING LINKS IS NOW: ", this.showSharingLinks);
  }

  gaClick(label: string) {
    this.gaEvent.emitEvent('footersocialsharing', 'click', label);
  }

  copyMyUrlToClipboard() {
    this.gaClick('copy');

    if(this.auth.isLoggedIn) {
      console.log("LOGGED IN. Time to select...");
      this.clipboardUrlEl.nativeElement.select(); // select it as current
      try {
        document.execCommand('copy');  // copy selected text
        this.clipboardUrlEl.nativeElement.blur();
        this.notifications.notify('success', 'Your syynpost link URL has been copied to your clipboard! You can now paste it wherever you\'d like.');
        window.scrollTo(0, 0);
      }
      catch (e) {
        console.log('Error copying user home link url. Error: ', e);
      }
    }
  }

  private updateUserHomeUrl() {
    try {
      let urlTree           = this.router.createUrlTree([this.auth.username]);
      let serializedTreeUrl = this.router.serializeUrl(urlTree);
      this.userHomeUrl      = window.location.origin + this.location.prepareExternalUrl(serializedTreeUrl);
      console.log("URL TO USE FOR COPY FUNCTION IS: ", this.userHomeUrl);
    }
    catch (e) {
      this.userHomeUrl = window.location.origin;
    }
  }

  // CALLS THE BUILD URL A LLLLLLLOOOOOOOOOTTTTTTTT of times. INEFFICIENT.
  private buildUrl(icon: string): string {
    const currentUrl = this.currentUrl;

    // UNO urls take :url
    switch(icon) {
      case 'twitter': {  // takes :text, :url, :hashtags
        return this.signpostApi.buildUrl(`social-${icon}`, [{':text': 'Check out my syynpost online directory.'}, {':url': currentUrl}, {':hashtags':'syynpost'}]);
      }
      case 'facebook': return this.signpostApi.buildUrl(`social-${icon}`, [{':url': currentUrl}]);
      case 'google':   return this.signpostApi.buildUrl(`social-${icon}`, [{':url': currentUrl}]);
      default:         return '';
    }
  }

  // CALL HERE OR SHOULD I RETURN THE VALUE TO SET EXPLICITLY?
  private updateCurrentUrl() {
    this.currentUrl = window.location.href;
  }

  // CALL HERE OR SHOULD I RETURN THE VALUE TO SET EXPLICITLY?
  private rebuildSocialSharingLinks() {
    this.socialSharingLinks = this.socialSharingLinks.map( (link: NavLink) => {
      console.log("LINK ICON IS: ", link.icon);
      link.url = this.buildUrl(link.icon);
      return link;
    });
  }
}

