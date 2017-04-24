import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { HelpersService } from '../shared/helpers/helpers.service';
import { Observable } from 'rxjs/Observable';
import { SignpostApi } from '../core/api/signpost-api.service';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';

export class NavLink {
  icon:    string;
  url:     string;
  bgColor: string;
};

const SOCIAL_LINKS: NavLink[] = [
  {icon: 'facebook-official', url: '',  bgColor: '#3b5998'},
  {icon: 'twitter',           url: '',  bgColor: '#007bb5'},
  {icon: 'google',            url: '',  bgColor: '#dd4b39'},
];

@Component({
  moduleId: module.id,
  selector: 'signpost-footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.css'],
})

export class FooterComponent {
  currentUrl:       string;
  currentUsername:  any;
  urlSubscription:  any;
  showSharingLinks: boolean = false;
  socialSharingLinks = SOCIAL_LINKS;

  constructor(private helpers:     HelpersService,
              private router:      Router,
              private signpostApi: SignpostApi,
              private http:        Http) {
    // Set Initial values
    this.updaateCurrentUrl();
    this.rebuildSocialSharingLinks();

    // HACKY, but currently the only way to get the username outside of a router-outlet
    // Set currentUrl & try to get currentUsername
    this.urlSubscription = this.router.events.subscribe( event => {

      // Update links on change
      this.updaateCurrentUrl();
      this.rebuildSocialSharingLinks();

      // Username? => set it if there is one
      if(event instanceof NavigationEnd) {
        let currentUrlTree = this.router.parseUrl(this.router.url);
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

  toggleShowSharingLinks(input: any = null): void {
    if(typeof(input) === 'boolean') { this.showSharingLinks = input; }
    else { this.showSharingLinks = !this.showSharingLinks; }
    console.log("SHARING LINKS IS NOW: ", this.showSharingLinks);
  }

  private ngOnDestroy() {
    this.urlSubscription.unsubscribe();
  }

  // CALLS THE BUILD URL A LLLLLLLOOOOOOOOOTTTTTTTT of times. INEFFICIENT.
  private buildUrl(icon: string): string {
    let currentUrl = this.currentUrl;

    // UNO urls take :url
    switch(icon) {
      case 'twitter': {  // takes :text, :url, :hashtags
        return this.signpostApi.buildUrl(`social-${icon}`, [{':text': 'hello world'}, {':url': currentUrl}, {':hashtags':'syynpost'}]);
      }
      case 'facebook-official': return this.signpostApi.buildUrl(`social-${icon}`, [{':url': currentUrl}]);
      case 'google':            return this.signpostApi.buildUrl(`social-${icon}`, [{':url': currentUrl}]);
      default:                  return '';
    }
  }

  // CALL HERE OR SHOULD I RETURN THE VALUE TO SET EXPLICITLY?
  private updaateCurrentUrl() {
    this.currentUrl = window.location.href;
  }

  // CALL HERE OR SHOULD I RETURN THE VALUE TO SET EXPLICITLY?
  private rebuildSocialSharingLinks() {
    this.socialSharingLinks = this.socialSharingLinks.map( (link: NavLink) => {
      link.url = this.buildUrl(link.icon);
      return link;
    });
  }
}

