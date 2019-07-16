import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute }    from '@angular/router';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';  // USING EVENT??? IF NO, REMOVE IT. KEPT JUST IN CASE NEED DURING CODING.
import { AuthService }       from '../../core/auth/auth.service';
import { ApiSearchService }  from '../../core/api/api-search.service';
import { ApiUsersLocationsService }  from '../../core/api/api-users-locations.service';
import { ApiLocationsService }  from '../../core/api/api-locations.service';
import { Listing }           from '../listing.model';
import { Location }          from '../../shared/models/location.model';
import { Subject, Subscription } from 'rxjs';

const DISTANCES = ['10', '25', '50', '75', '100', '200', '500', 'any'];


@Component({
  moduleId: module.id,
  selector: 'listings-search',
  templateUrl: 'listings-search.component.html',
  styleUrls:  ['listings-search.component.css']
})

export class ListingsSearchComponent implements OnInit {
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  listings: Listing[];    // Allow variable search type
  distances: any[] = DISTANCES;
  userLocations: Location[] = [];
  hasSearched = false;  // dont show "0 results" before a search
  isLoggedIn: boolean = false;
  searchInfo: any = {
    searchStr: '',  // Listings search text
    distance: '',
    postal: '',     // If location is numbers = populate this
    locationId: '', // If location text does not exist = populate this
    citystate: '',  // If location is not just numbers - populate this
    location: ''
  };
  typeaheads: any[];
  typeaheadSub: Subscription;
  typeaheadEmit: Subject<any[]> = new Subject<any[]>();

  showAdvanced: boolean = false;
  userLocsSub: Subscription;
  userLocsEmit: Subject<any> = new Subject<any>();

  constructor(
              private   apiSearchService: ApiSearchService,
              protected authService:      AuthService,
              private   route:            ActivatedRoute,
              private   usersLocsService: ApiUsersLocationsService,
              private   locationService:  ApiLocationsService,
              ) {}

  ngOnInit() {
    const that = this;
    // Set searchQuery to our search, if exists (user clicked 'back'), or set empty
    this.searchInfo.searchStr  = this.route.snapshot.queryParams['search'] || '';
    this.searchInfo.postal     = this.route.snapshot.queryParams['postal'];
    this.searchInfo.distance   = this.route.snapshot.queryParams['distance'] || this.distances[7];
    this.searchInfo.locationId = this.route.snapshot.queryParams['locationId'] || '';
    this.searchInfo.citystate  = this.route.snapshot.queryParams['citystate'] || '';
    this.isLoggedIn = !!this.authService.auth.isLoggedIn;  // set initial value

    // Used for getting/setting loggedIn user's default location; Update locations & the search location if needed
    // this.userLocsSub = this.userLocsEmit.subscribe((newLocs) => {
    //   that.userLocations = newLocs;
    //   this.setLocation();
    // });

    this.typeaheadSub = this.typeaheadEmit.subscribe( (newTypeaheads: any[]) => {
      console.log("SETTING TYPEAHEAD Locations: ", newTypeaheads);
      that.typeaheads = newTypeaheads;
      console.log("TYPEAHEADS IS NOW", this.typeaheads);
    });

    // if(this.isLoggedIn) {
    //   // NOTE: THIS COULD HAVE PROBLEMS IF USERID IS NOT AVAIL BUT ISLOGGEDIN IS TRUE SOMEHOW
    //   this.usersLocsService.getLocationsByUserId(this.authService.auth.userId)
    //       .subscribe(
    //         results => {
    //           console.log("USER LOCATIONS FOUND ARE: ", results);
    //           // NOTE: MAY NEED A SUBSCRIPTION HERE FOR THE UPDATE
    //           that.userLocsEmit.next(results.locations);
    //         },
    //         error => {
    //           console.log("ERROR GETTING USER LOCATIONS: ", error);
    //         });
    // }

    // ???????
    if(this.searchInfo.searchStr) { this.search(null); }
  }

  // setLocation() {
  //   let defaultLoc = this.userLocations.find(function(elem) { return !!elem.isDefault; });
  //   console.log("DEFAULT LOC IS: ", defaultLoc);

  //   // HAS to assign the same referenced value, else will think it's a different one & not auto-populate existing dropdown value
  //   if(this.isLoggedIn && defaultLoc && (this.searchInfo.locationId == '' || this.searchInfo.locationId == defaultLoc.userLocationId)) {
  //       console.log("Setting search default location for user... ", defaultLoc.userLocationId);
  //       this.searchInfo.locationId = defaultLoc.userLocationId;
  //   }
  // }

  toggleAdvanced(input: any = null): void {
    // If setting value directly, do that. Else, just toggle the value
    if(typeof(input) === 'boolean') { this.showAdvanced = input; }
    else { this.showAdvanced = !this.showAdvanced; }
  }

  getTypeaheads() {
    const that = this;
    var cityAndState = this.parseLocation(); // {postal: '', city: '', stateCode: ''};

    console.log("INPUT TRIGGERED TYPEAHEAD CHANGES TO GET NEW RESULTS: ", cityAndState);
    if(this.searchInfo.location.length > 2) {
      const maxResults = '7';
      this.locationService
        .locationTypeahead(this.searchInfo.postal, cityAndState.city, cityAndState.stateCode, maxResults)
        .subscribe(
          results => {
            console.log("SUCCESS GETTING TYPEAHEAD RESULTS: ", results);
            that.typeaheadEmit.next(results.locations);
          },
          error => {
            console.log("ERROR GETTING TYPEAHEAD RESULTS: ", error);
          });
    }
  }

  private parseLocation() {
    const cityStatePostal: any = {};

    try {
      const postal = parseInt(this.searchInfo['postal']);
      // Postal NOT an int? Use city/state
      if(Number.isNaN(postal)) {
        const parsedCityState = this.searchInfo['location'].split(',');
        cityStatePostal['city'] = parsedCityState[0];
        cityStatePostal['stateCode'] = (parsedCityState.length > 1 ? parsedCityState[1] : '');
      }
      // Postal is an int - use it
      else {
        cityStatePostal['postal'] = postal;
      }
    }
    catch(e) {
      console.log("Could not use provided location. Error: ", e);
    }

    return cityStatePostal;
  }

  search(event: any) {
    if(event) { event.preventDefault(); }  // if get here with form submit
    if(this.searchInfo.searchStr && history.pushState) {
      this.updateExistingUrl(
        this.searchInfo.searchStr,
        this.searchInfo.distance,
        this.searchInfo.postal,
        this.searchInfo.locationId,
        this.searchInfo.citystate
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
  private updateExistingUrl(searchStr: string, distance: string = '100', postal: string = '98101', locationId: string = '', citystate: string = '') {
    const updatedSearchUrl = window.location.protocol + '//' +  // https://
                             window.location.host +             // www.syynpost.com
                             window.location.pathname +         // /
                             '?search=' + searchStr +  // ?search=Superman
                             '&distance=' + distance + // ?search=Superman&distance=any
                             '&postal=' + postal +  // ?search=Superman&distance=100&postal=98101
                             '&locationId=' + locationId +
                             '&citystate=' + citystate;  // ?search=Superman&distance=100&postal=98101
    // Update the existing history for page (don't pushState, replaceState)
    window.history.replaceState({path: updatedSearchUrl}, '', updatedSearchUrl);
  }
}
