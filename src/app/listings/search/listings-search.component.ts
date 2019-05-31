import { Component, OnInit } from '@angular/core';
import { ActivatedRoute }    from '@angular/router';
import { AuthService }       from '../../core/auth/auth.service';
import { ApiSearchService }  from '../../core/api/api-search.service';
import { ApiUsersLocationsService }  from '../../core/api/api-users-locations.service';
import { Listing }           from '../listing.model';
import { Location }          from '../../shared/models/location.model';
import { Subject, Subscription } from 'rxjs';

const DISTANCES = ['10', '25', '50', '75', '100', '200', '500', 'ANY'];


@Component({
  moduleId: module.id,
  selector: 'listings-search',
  templateUrl: 'listings-search.component.html',
  styleUrls:  ['listings-search.component.css']
})

export class ListingsSearchComponent implements OnInit {
  listings: Listing[];    // Allow variable search type
  distances: any[] = DISTANCES;
  userLocations: Location[] = [];
  hasSearched = false;  // dont show "0 results" before a search
  isLoggedIn: boolean = false;
  searchInfo: any = {
    searchStr: '',
    distance: '',
    postal: '',
    locationId: ''
  };
  userLocsSub: Subscription;
  userLocsEmit: Subject<any> = new Subject<any>();

  constructor(
              private   apiSearchService: ApiSearchService,
              protected authService:      AuthService,
              private   route:            ActivatedRoute,
              private   usersLocsService: ApiUsersLocationsService
              // private   gaEvent:          GAEventService
              ) {}

  ngOnInit() {
    const that = this;
    // Set searchQuery to our search, if exists (user clicked 'back'), or set empty
    this.searchInfo.searchStr  = this.route.snapshot.queryParams['search'] || '';
    this.searchInfo.postal     = this.route.snapshot.queryParams['postal'] || '98101';
    this.searchInfo.distance   = this.route.snapshot.queryParams['distance'] || this.distances[4];
    this.searchInfo.locationId = this.route.snapshot.queryParams['locationId'] || '';
    this.isLoggedIn = !!this.authService.auth.isLoggedIn;  // set initial value

    // Update locations & the search location if needed
    this.userLocsSub = this.userLocsEmit.subscribe((newLocs) => {
      that.userLocations = newLocs;
      this.setLocation();
    });

    if(this.isLoggedIn) {
      // NOTE: THIS COULD HAVE PROBLEMS IF USERID IS NOT AVAIL BUT ISLOGGEDIN IS TRUE SOMEHOW
      this.usersLocsService.getLocationsByUserId(this.authService.auth.userId)
          .subscribe(
            results => {
              console.log("USER LOCATIONS FOUND ARE: ", results);
              // NOTE: MAY NEED A SUBSCRIPTION HERE FOR THE UPDATE
              that.userLocsEmit.next(results.locations);
            },
            error => {
              console.log("ERROR GETTING USER LOCATIONS: ", error);
            });
    }

    // ???????
    if(this.searchInfo.searchStr) { this.search(null); }
  }

  setLocation() {
    let defaultLoc = this.userLocations.find(function(elem) { return !!elem.isDefault; });
    console.log("DEFAULT LOC IS: ", defaultLoc);

    // HAS to assign the same referenced value, else will think it's a different one & not auto-populate existing dropdown value
    if(this.isLoggedIn && defaultLoc && (this.searchInfo.locationId == '' || this.searchInfo.locationId == defaultLoc.userLocationId)) {
        console.log("Setting search default location for user... ", defaultLoc.userLocationId);
        this.searchInfo.locationId = defaultLoc.userLocationId;
    }
  }

  search(event: any) {
    if(event) { event.preventDefault(); }  // if get here with form submit
    if(this.searchInfo.searchStr && history.pushState) {
      this.updateExistingUrl(
        this.searchInfo.searchStr,
        this.searchInfo.distance,
        this.searchInfo.postal,
        this.searchInfo.locationId
      );
    }
    const that = this;
    console.log("SEARCHING CLICKED!");
    console.log("Search string is: ", this.searchInfo.searchStr);
    console.log("Postal is: ", this.searchInfo.postal);
    console.log("Distance is: ", this.searchInfo.distance);
    console.log("LocationId is: ", this.searchInfo.locationId);

    // FIXME: THIS NEEDS TO BE UPDATED TO SEND THESE VALUES DOWN TO THE API
    this.apiSearchService.searchListings(
      this.searchInfo.searchStr,
      this.searchInfo.distance,
      this.searchInfo.postal,
      this.searchInfo.locationId)
        .subscribe(
          results => {
            console.log("SEARCH RESULTS FOUND ARE: ", results);
            that.listings  = results;
            that.hasSearched = true;
          },
          error => {
            console.log("SEARCH ERROR RETURNED: ", error);
          });
    // this.gaClick('searchsubmit');
  }

  // TODO: ? Maybe break this out into a shared method in Helpers or a Utils file
  // Updates history of current page, so can come back to with window.history.back();
  private updateExistingUrl(searchStr: string, distance: string = '100', postal: string = '98101', locationId: string = '') {
    const updatedSearchUrl = window.location.protocol + '//' +  // https://
                             window.location.host +             // www.syynpost.com
                             window.location.pathname +         // /
                             '?search=' + searchStr +  // ?search=Superman
                             '&distance=' + distance + // ?search=Superman&distance=any
                             '&postal=' + postal +  // ?search=Superman&distance=100&postal=98101
                             '&locationId=' + locationId;  // ?search=Superman&distance=100&postal=98101
    // Update the existing history for page (don't pushState, replaceState)
    window.history.replaceState({path: updatedSearchUrl}, '', updatedSearchUrl);
  }
}
