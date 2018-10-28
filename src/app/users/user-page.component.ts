import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params }       from '@angular/router';
import { AuthService, UserAuth }        from '../core/auth/auth.service';
import { ApiListingsService }           from '../core/api/api-listings.service';
import { Subscription }                 from 'rxjs/Subscription';
import { Subject }                      from 'rxjs/Subject';
import { IconService }                  from '../core/services/icon.service';
import { Listing }                      from '../listings/listing.model';
import 'rxjs/add/operator/switchMap';



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
  listingsSubscription: Subscription;
  isOwner = false;
  isProcessing: boolean;
  usernameFromRoute: string;
  listings: Listing[] = [];  // SOMEDAY GET THIS FROM API CALL FOR USER"S LISTINGS
  listingsEmit: Subject<Listing[]> = new Subject<Listing[]>();

  constructor( private authService:     AuthService,
               private icons:           IconService,
               private route:           ActivatedRoute,
               private listingsApi:     ApiListingsService) {
    this.auth = authService.auth;
    this.authSubscription = authService.userAuthEmit.subscribe((newVal: UserAuth) => {
      this.auth = newVal;
    });
    // TODO: get this listener working so that added listings will automatically show on save w/o GET request.
    // this.listingsSubscription = this.listingsEmit.subscribe((newVal: Listing) => {
    //   // When emit newListing, take it and add it to listings model
    //   this.listings.push(newVal);
    // });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
    this.pageSubscription.unsubscribe();
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
    });
  }

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  getListings() {
    const that = this;

    this.listingsApi
      .getListingsByUser(that.usernameFromRoute)
      .subscribe(
        listings => {
          console.log("LISTINGS FOUND: ", listings);
          that.listings = listings;
        },
        error => {
          console.log("ERROR GETTING LISTINGS: ", error);
        });
  }

  save(event: any) {
    let newListing = event;
    console.log("FOUND NEW LISTING TO ADD IF NOT ALREADY ADDED");
    let ids = this.listings.map(listing => listing.id);
    let matchFound = ids.find(id => { return (id === newListing.id); } );

    // If not already added, then add
    if(!matchFound) {
      console.log("ADDING THIS LISTING: ", newListing);
      this.listings.push(newListing)
      // this.listings.push(newListing);
      this.listingsEmit.next(this.listings);
    }
  }

  private updateUsernameBasedData(username: string) {
    this.usernameFromRoute = username;
    console.log("Username from route is: ", this.usernameFromRoute);

    this.isOwner = this.authService.isOwner(this.usernameFromRoute);
    console.log("ISOWNER IS: ", this.isOwner);

    // this.updateSignsFromUsername(username);  // NOTE: See below
  }

  // NOTE: Sometimes updates to a user affect links on a page. Must propogate reload page data like this:
  // private updateSignsFromUsername(username: string) {
  //   const that = this;

  //   this.isProcessing = true;
  //   this.apiSignsService.getSignsByUsernameOrId(username)
  //       .subscribe(
  //         signs => {
  //           console.log("SIGNS RETURNED TO USER PAGE IS: ", signs);
  //           that.signs = signs;  // data is structured at level above
  //           that.isProcessing = false;
  //         },
  //         error => {
  //           console.log("ERR RETURNED FROM GET BY ID: ", error.json());
  //           return error.json();
  //         }
  //       );
  // }
}
