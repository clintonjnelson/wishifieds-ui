import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params }       from '@angular/router';
import { AuthService, UserAuth }        from '../core/auth/auth.service';
import { ApiListingsService }           from '../core/api/api-listings.service';
import { ApiMessagesService }           from '../core/api/api-messages.service';
import { Subscription, Subject }        from 'rxjs';
import { IconService }                  from '../core/services/icon.service';
import { Listing }                      from '../listings/listing.model';
import { switchMap }                    from 'rxjs/operators';
import { MatBadgeModule }               from '@angular/material';
import { MatTabChangeEvent }            from '@angular/material';


// TODO: Use the end of the route to set the correct tab

@Component({
  moduleId: module.id,
  selector: "user-page",
  templateUrl: 'user-page.component.html',
  styleUrls:  ['user-page.component.css']
})
export class UserPageComponent implements OnInit, OnDestroy {
  auth: UserAuth;
  authSubscription: Subscription;
  pageSubscription: Subscription;
  tabsSubscription: Subscription;
  listingsSubscription: Subscription;
  listingsEmit: Subject<Listing[]> = new Subject<Listing[]>();
  // favoritesSub: Subscription;
  // favoritesEmit: Subject<Listing[]> = new Subject<Listing[]>();

  isOwner = false;
  isProcessing: boolean;

  usernameFromRoute: string;
  currentTabIndex: number;
  tabMap = ['wishlistings', 'messages', 'favorites'];

  totalUnreadMsgs: string;
  favorites: Listing[] = [];
  listings: Listing[] = [];

  constructor( private authService:     AuthService,
               private icons:           IconService,
               private route:           ActivatedRoute,
               private listingsApi:     ApiListingsService,
               private messagesApi:     ApiMessagesService) {
    // Subscribe to the auth service, so stay updated on changes
    this.auth = authService.auth;
    this.authSubscription = authService.userAuthEmit.subscribe((newVal: UserAuth) => {
      this.auth = newVal;
    });
    this.listingsSubscription = this.listingsEmit.subscribe((newListings: Listing[]) => {
      if(newListings && newListings.length) {
        // Initial GET listings may get lots; saving a listing adds only one.
        this.listings = this.listings.concat(newListings);  // Concat & SET
      }
    });
    // this.favoritesSub = this.favoritesEmit.subscribe((newFavs: Listing[]) => {
    //   if(newFavs && newFavs.length) {
    //     // Initial GET listings may get lots; saving a listing adds only one.
    //     this.favorites = this.favorites.concat(newFavs);  // Concat & SET
    //   }
    // });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
    this.pageSubscription.unsubscribe();
    this.tabsSubscription.unsubscribe();
    this.listingsSubscription.unsubscribe();
  }

  ngOnInit(): void {
    const that = this;
    // If username changes, this updates the routeParams!
    this.pageSubscription = this.route.params.subscribe( (params: Params) => {
      const username = params['username'];
      console.log("TRIGGERED SUBSCRIPTION THAT WATCHES PARAMS: ", params);
      that.updateUsernameBasedData(username);
      this.getListings();
      this.getFavorites();
    });
    // Update the page tab based on the URL specified tab
    this.tabsSubscription = this.route.queryParams.subscribe( params => {
      let tabName = params['tab'];
      if(!!tabName) {
        let tabIndex = that.tabMap.indexOf(tabName);
        that.currentTabIndex = tabIndex;
      }
    });
    this.getTotalUnreadMsgs();  // TODO: WHY IS THIS NOT IN THE PAGE SUBSCRIPTION??
  }

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  setCurrentTab(event: MatTabChangeEvent) {
    const tab = this.tabMap[event.index];
    this.updateExistingUrl(tab)
  }

  getListings() {
    const that = this;

    this.listingsApi
      .getListingsByUser(that.usernameFromRoute)
      .subscribe(
        listings => {
          console.log("LISTINGS FOUND: ", listings);
          that.listingsEmit.next(listings);  // Add these via observer
        },
        error => {
          console.log("ERROR GETTING LISTINGS: ", error);
        });
  }

  getFavorites() {
    const that = this;
    if(this.auth.isLoggedIn && this.isOwner) {
      this.listingsApi
        .getFavoriteListingsByUser()
        .subscribe(
          favs => {
            console.log("FAVORITES FOUND: ", favs);
            // that.favoritesEmit.next(favs);  // Add these via observer
            if(favs && favs.length) {
              // Initial GET listings may get lots; saving a listing adds only one.
              this.favorites = this.favorites.concat(favs);  // Concat & SET
            }
          },
          error => {
            console.log("ERROR GETTING LISTINGS: ", error);
          });
    }
  }

  // Get total unread messages so can display on the Messages tab
  getTotalUnreadMsgs() {
    const that = this;
    if(this.auth.isLoggedIn && this.isOwner) {
      this.messagesApi
        .getUserTotalUnreadMessages()
        .subscribe(
          res => {
            console.log("TOTAL UNREAD MESSAGES OBJECT: ", res);
            that.totalUnreadMsgs = res.totalUnreads;
          },
          error => {
            console.log("ERROR GETTING TOTAL UNREAD MESSAGES COUNT");
          });
    }
  }

  save(event: any) {
    let newListing = event;
    console.log("FOUND NEW LISTING TO ADD IF NOT ALREADY ADDED");
    let ids = this.listings.map(listing => listing.id);
    let matchFound = ids.find(id => { return (id === newListing.id); } );

    // If not already added, then add
    if(!matchFound) {
      console.log("ADDING THIS LISTING: ", newListing);
      // this.listings.push(newListing);
      this.listingsEmit.next([newListing]);
    }
  }

  private updateUsernameBasedData(username: string) {
    this.usernameFromRoute = username;
    console.log("Username from route is: ", this.usernameFromRoute);

    this.isOwner = this.authService.isOwner(this.usernameFromRoute);
    console.log("ISOWNER IS: ", this.isOwner);
  }

  private updateExistingUrl(tab: string) {
    if(window.history.pushState) {
      const updatedTabUrl = window.location.protocol + '//' +  // https://
                             window.location.host +             // www.syynpost.com
                             window.location.pathname +         // /
                             '?tab=' + tab;  // ?searchQuery=Superman
    // Update the existing history
    window.history.pushState({path: updatedTabUrl}, '', updatedTabUrl);
    }
  }
}
