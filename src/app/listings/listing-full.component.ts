import { Component, Input, Output, ViewChild, OnInit, AfterViewInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params, NavigationEnd } from '@angular/router';
import { IconService } from '../core/services/icon.service';
import { HelpersService } from '../shared/helpers/helpers.service';
import { AuthService } from '../core/auth/auth.service';
import { ApiMessagesService } from '../core/api/api-messages.service';
import { ApiFavoritesService } from '../core/api/api-favorites.service';
import { Listing } from './listing.model';
import { MatBadgeModule, MatTabChangeEvent } from '@angular/material';
import { Subject, Subscription } from 'rxjs';
import { filter, pairwise } from 'rxjs/operators';
// import 'rxjs/add/operator/filter';
// import 'rxjs/add/operator/pairwise';
// import { ImgCarouselComponent } from '../shared/carousel/img-carousel.component';  // NOT SURE IF NEED. TRY DELETING LATER. VERIFY IN PROD BUILD.



@Component({
  moduleId: module.id,
  selector: 'listing-full',
  templateUrl: 'listing-full.component.html',
  styleUrls: ['listing-full.component.css']
})
export class ListingFullComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() listing: Listing;
  @Input() isPreview: boolean = false;  // TODO: MAKE THIS SET READONLY CAPABILITIES TO LISTING
  @Input() isEditing: boolean = false;  // TODO: Verify if should default this or Not.
  @Output() editingEE = new EventEmitter<boolean>();

  tabsSubscription: Subscription;
  currentViewerId: string;
  isLoggedIn: boolean = false;
  isOwner: boolean = true;  // TODO: HOOK THIS UP; NEEDED FOR BUTTONS & SUCH.
  msgCorrespondants = [];
  unreadMessages: number;
  showingMessagesOfUserId: string = '0';
  defaultPicUrl = '/assets/profile_default.png'; // FIXME: Make this a config value set single place elsewhere
  listingLink: string;

  // Tabs
  currentTabIndex: number;
  tabMap = ['messages', 'locations'];

  isFavorite: boolean = false;
  favSub: Subscription;
  favEmit: Subject<boolean> = new Subject<boolean>();

  badges: any = {};
  public carouselConfig = {
    grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
    slide: 1,
    speed: 400,
    // interval: {},
    point: {
      visible: true
    },
    load: 2,
    velocity: 0,
    touch: true,
    loop: true,
    custom: 'banner',
    easing: 'cubic-bezier(0, 0, 0.2, 1)'
  };

  constructor(private icons: IconService,
              private helpers: HelpersService,
              private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private messagesApi: ApiMessagesService,
              private favoritesApi: ApiFavoritesService) {
    // router.events
    //   .pipe(
    //     filter(e => e instanceof NavigationEnd),
    //     pairwise()
    //   )
    //   .subscribe((navEnd: any[]) => {
    //     // const navEnd = navEnd as instanceof NavigationEnd;
    //     console.log("BACK urlAfter: ", navEnd[0]['urlAfterRedirects']);
    //     console.log("BACK string: ", navEnd.toString());
    //     console.log("BACK url manual: ", navEnd[0]['url']);
    //     if(navEnd && navEnd[0] && navEnd[0]['url'] && navEnd[0]['url'].startsWith('/')) {
    //       console.log("SETTING BACK FLAG true...");
    //       this.hasInternalBackAddress = true;
    //     }
    //   });
  }

  // Determine who viewer is (owner or guest), so can decide content to show
  // Determine if isOwner for owner-only related parts & logic (msgs & such)
  // Get the listingLink, so can link to the listing
  ngOnInit() {
    const that = this;
    this.isLoggedIn = this.authService.auth.isLoggedIn;
    this.currentViewerId = this.authService.auth.userId;
    this.isOwner = this.helpers.isEqualStrInt(this.listing.userId, this.currentViewerId);
    this.listingLink = this.helpers.buildUserListingLink(
      this.router,
      this.listing.ownerUsername,
      this.listing.id);
    this.getCorrespondantMessagesInfo();
    this.favSub = this.favEmit.subscribe(function(newState) {
      that.isFavorite = newState;
    });
    this.getFavorites();

    this.tabsSubscription = this.route.queryParams.subscribe( params => {
      let tabName = params['tab'];
      if(!!tabName) {
        let tabIndex = that.tabMap.indexOf(tabName);
        that.currentTabIndex = tabIndex;
      }
    });

    this.badges = {};
    this.loadBadges();
    console.log("IS OWNER IS, listindOwner, currentViewer: ", this.isOwner, this.listing.userId, this.currentViewerId);
    console.log("LISTING FULL: Listing object is: ", this.listing);
  }

  ngAfterViewInit() {
    console.log("QUERY PARAM TAG IS: ", this.route.snapshot.queryParams['tab']);
    this.refreshMap(this.route.snapshot.queryParams['tab']);
  }

  ngOnDestroy() {
    this.favSub.unsubscribe();
  }

  buildIconClass(icon: string, size: string = '2', type: string = "s") {
    return this.icons.buildIconClass(icon, size, type);
  }

  setCurrentTab(event: MatTabChangeEvent) {
    const tab = this.tabMap[event.index];
    this.updateExistingUrl(tab)
  }

  // For the a-link href generation
  verifyOrAddProtocolToUrl(url: string) {
    return this.helpers.verifyOrAddProtocolToUrl(url)
  }

  // For the a-link href display
  urlWithoutPrototol(url: string) {
    return this.helpers.urlWithoutProtocol(url);
  }

  toggleEditing(input: any = null): void {
    // Update the value locally
    if(typeof(input) === 'boolean') { this.isEditing = input; }
    else { this.isEditing = !this.isEditing; }

    console.log("EDITING TOGGLED & IS NOW: ", this.isEditing);
    // Emit the value back up the chain
    console.log("In listing-full. BUBBLING UP editingEE with value: ", this.isEditing);
    this.editingEE.emit(this.isEditing);
  }

  toggleHeart() {
    const that = this;
    console.log("TOGGLING IS FAVORITE...");
    if(!this.isPreview) {
      if(this.isFavorite) {
        console.log("TOGGLING -- OFF...");
        this.favoritesApi.removeFavorite(this.listing.id).subscribe(
          res => {
            if(res.success) {
              that.favEmit.next(false);
              console.log("SUCCESSFULLY TOGGLED OFF.");
            }
            else { console.log("Request failed. Doing nothing."); }
          },
          err => { console.log('Could not remove favorite.'); }
        );
      }
      else {
        console.log("TOGGLING -- ON...");
        this.favoritesApi.addFavorite(this.listing.id).subscribe(
          res => {
            if(res.success) {
              that.favEmit.next(true);
              console.log("SUCCESSFULLY TOGGLED ON.");
            }
            else { console.log("Request failed. Doing nothing."); }
          },
          err => { console.log('Could not add favorite.'); }
        );
      }
    }
  }

  getFavorites() {
    const that = this;
    if(this.authService.auth.isLoggedIn && !this.isPreview) {
      this.favoritesApi.getFavoritesForUser([that.listing.id])
        .subscribe(
          res => {
            // Get the favorite by ID & truthy it (in case it's undefined)
            console.log("CURRENT STATE OF FAVORITE IS: ", res);
            that.favEmit.next(!!res.favStatuses[that.listing.id]);  // truthy for undefined
            console.log("IS FAVORITE IS: ", that.isFavorite)
          },
          err => {
            console.log("Error getting favorites: ", err);
          }
      );
    }
  }
  // Load any info needed for passing to messages boxes
    // If viewer is owner, then get ALL users on listing
    // If viewer is NOT owner, then VIEWER is only user needed & already have them!
  getCorrespondantMessagesInfo() {
    const that = this;
    console.log("IS OWNER IS: ", this.isOwner);
    if(!this.isPreview) {
      if(this.isOwner) {
        console.log("THIS IS THE OWNER OF THE LISTING: ", this.isOwner);
        // Listing owner may be talking with many people
        this.messagesApi.getListingMessagesCorrespondants(this.listing.id)
          .subscribe(
            res => {
              console.log("CORRESPONDANTS RETURNED ARE: ", res.correspondants);
              that.msgCorrespondants = res.correspondants;
              console.log("CORRESPONDANTS ARE: ", that.msgCorrespondants);
              // Total unread messages for Listing
              that.unreadMessages = res.totalUnread;
            },
            error => {
              console.log("Error getting message correspondants: ", error);
            });
      }
      else {
        // If not owner, then owner should be only correspondant
        this.msgCorrespondants = [that.listing.userId];
      }
    }
  }

  loadBadges() {
    const that = this;
    const badges = this.listing['badges'].forEach(function(badge) {
      that.badges[badge.badgeType] = {
          badgeType: badge.badgeType,
          linkUrl: badge.linkUrl
        };
    });
  }

  setMessageToShow(msgUserId) {
    this.showingMessagesOfUserId = (msgUserId === this.showingMessagesOfUserId) ? '0' : msgUserId;
    this.scrollToLatestMsg();
  }

  closeListing(): void {
    this.toggleEditing(false);

    // Came from somewhere linked
    // console.log("HISTORY LENGTH IS: ", window.history.length);
    // console.log("LOCATION HOST IS: ", window.location.host);
    // console.log("CHECK OF HOST INDEX IS: ", document.referrer.indexOf(window.location.host));
    // console.log("HAS INTERNAL ADDRESS: ", this.hasInternalBackAddress);

    window.history.back();
    // // external history management
    // if((window.history.length > 1 && document.referrer.indexOf(window.location.host) !== -1)) {
    //   console.log("GOING STRAIGHT BACK...");
    //   window.history.back();
    // }
    // // If owner is viewing own listing & closes, go back to their withlistings home
    // else if(this.isOwner) {
    //   console.log("username from auth is: ", this.authService.auth.username);
    //   this.router.navigate([this.authService.auth.username], { queryParams: { tab: 'wishlistings' }});
    // }
    // // If viewing someone else's listing, go to listings search page
    // else {
    //   this.router.navigate(['']);
    // }
  }

  private scrollToLatestMsg() {
    if(this.showingMessagesOfUserId !== '0') {
      setTimeout( () => {
        const previewEl = document.getElementsByClassName('message-preview-container')[0];
        console.log("ELEMENT TO SCROLL TO IS: ", previewEl);
        previewEl.scrollIntoView({behavior: 'smooth'});
      }, 200);
    }
  }

  private updateExistingUrl(tab: string) {
    if(window.history.pushState) {
      const updatedTabUrl = window.location.protocol + '//' +  // https://
                             window.location.host +             // www.syynpost.com
                             window.location.pathname +         // /
                             '?tab=' + tab;  // ?tab=Superman
      // Update the existing history
      window.history.pushState({path: updatedTabUrl}, '', updatedTabUrl);
    }

    // Trigger resize to fix map only displaying one tile due to hidden tab; reloads map.
    this.refreshMap(tab);
  }

  private refreshMap(tab) {
    if(tab && tab == 'locations') {
      window.dispatchEvent(new Event('resize'));
    }
  }
}
