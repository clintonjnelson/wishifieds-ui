import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute }    from '@angular/router';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';  // USING EVENT??? IF NO, REMOVE IT. KEPT JUST IN CASE NEED DURING CODING.
import { AuthService }       from '../../core/auth/auth.service';
import { ApiSearchService }  from '../../core/api/api-search.service';
import { ApiUsersLocationsService }  from '../../core/api/api-users-locations.service';
import { ApiLocationsService }  from '../../core/api/api-locations.service';
import { Listing }           from '../listing.model';
import { UserLocation }          from '../../shared/models/location.model';
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
  userLocations: UserLocation[] = [];
  hasSearched = false;  // dont show "0 results" before a search
  isLoggedIn: boolean = false;
  searchInfo: any = {
    searchStr: '',  // Listings search text
    distance: '',
    location: '',   // This is the typeahead location text; could be postal or city/state
    // zipcode= '',     // If location is numbers = populate this
    // city: '',  // If location is not just numbers - populate this
    // stateCode: '',  // If location is not just numbers - populate this
    locationId: '', // If user is logged in; use this unless specified otherwise
    showExtentsOnMap: false,  // show the map radius circle?
    centerCoords: []  // center lat/lng coords (ie: geoInfo)
  };
  typeaheads: any[];
  typeaheadSub: Subscription;
  typeaheadEmit: Subject<any[]> = new Subject<any[]>();

  searchInfoSub: Subscription;
  searchInfoEmit: Subject<any> = new Subject<any>();

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
    this.searchInfo.distance   = this.route.snapshot.queryParams['distance'] || this.distances[7];
    this.searchInfo.location   = this.route.snapshot.queryParams['location'] || '';
    this.searchInfo.locationId = this.route.snapshot.queryParams['locationId'] || '';
    this.isLoggedIn = !!this.authService.auth.isLoggedIn;  // set initial value
    this.searchInfoSub = this.searchInfoEmit.subscribe( (wasApiCallMade: any[]) => {
      console.log("Did location need to be retrieved from API: ", wasApiCallMade);
    });

    this.typeaheadSub = this.typeaheadEmit.subscribe( (newTypeaheads: any[]) => {
      console.log("SETTING TYPEAHEAD Locations: ", newTypeaheads);
      that.typeaheads = newTypeaheads;
      console.log("TYPEAHEADS IS NOW", this.typeaheads);
    });

    // If logged in & no search location, use the user's default location until select otherwise
    if(this.isLoggedIn) {
      // Used for updating default location for logged in users; Update locations & the search location if needed
      this.userLocsSub = this.userLocsEmit.subscribe((newLocs) => {
        that.userLocations = newLocs;
        this.setLoggedInUserLocation();
      });

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

    if(this.searchInfo.searchStr) { this.search(null); }  // Trigger search, no typ event
  }

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

  selectDistance(event) {
    const that = this;

    // Only reload with changes AFTER initial search
    if(this.hasSearched) { this.search(null); }
  }

  selectLocationTA(event) {
    const that = this;
    // Only reload with changes AFTER initial search
    const selectedTypeahead = this.typeaheads.find(function(ta) {
        return (ta.locationId = that.searchInfo['locationId']);
      });  // get the geoInfo object off of the result. Worst case is null.
    this.searchInfo['centerCoords'] = (selectedTypeahead ? selectedTypeahead['geoInfo'] : []);
    if(this.hasSearched) { this.search(null); }
  }

  search(event: any) {
    if(event) { event.preventDefault(); }  // if get here with form submit
    if(this.searchInfo.searchStr && history.pushState) {
      this.updateExistingUrl(
        this.searchInfo.searchStr,
        this.searchInfo.distance,
        this.searchInfo.location,
        this.searchInfo.locationId,
      );
    }
    const that = this;
    console.log("SEARCHING CLICKED!");
    console.log("Search string is: ", this.searchInfo.searchStr);
    // console.log("Postal is: ", this.searchInfo.postal);
    console.log("Distance is: ", this.searchInfo.distance);
    console.log("Location is: ", this.searchInfo.location);
    console.log("LocationId is: ", this.searchInfo.locationId);

    const locationInfo = this.parseLocation();
    console.log("Parsed location info is: ", locationInfo);

    // Get/Search for the listings
    this.apiSearchService.searchListings(
      this.searchInfo.searchStr,
      this.searchInfo.distance,
      locationInfo['postal'],
      locationInfo['city'],
      locationInfo['stateCode'],
      this.searchInfo.locationId
      )
        .subscribe(
          results => {
            console.log("SEARCH RESULTS FOUND ARE: ", results);
            that.searchInfo = Object.assign({}, that.searchInfo);  // Force trigger change detection (update @Input downstream)
            that.listings  = results;
            that.hasSearched = true;
          },
          error => {
            console.log("SEARCH ERROR RETURNED: ", error);
          });
  }




  // TODO: ? Maybe break this out into a shared method in Helpers or a Utils file
  // Updates history of current page, so can come back to with window.history.back();
  private updateExistingUrl(searchStr: string, distance: string = 'any', location: string = '', locationId: string = '') {
    const updatedSearchUrl = window.location.protocol + '//' +  // https://
                             window.location.host +             // www.syynpost.com
                             window.location.pathname +         // /
                             '?search=' + searchStr +  // ?search=Superman
                             (distance ? '&distance=' + distance : '')+ // ?search=Superman&distance=any
                             (location ? '&location=' + location : '')+  // ?search=Superman&distance=100&location=98101
                             (locationId ? '&locationId=' + locationId : ''); // ?search=Superman&distance=100&location=98101,locationId=33
    // Update the existing history for page (don't pushState, replaceState)
    console.log("UPDATING THE URL WITH: ", updatedSearchUrl);
    window.history.replaceState({path: updatedSearchUrl}, '', updatedSearchUrl);
  }

  // Setting location for logged in users
  private setLoggedInUserLocation() {
    let defaultLoc = this.userLocations.find(function(elem) { return !!elem.isDefault; });
    console.log("DEFAULT LOC IS: ", defaultLoc);

    // HAS to assign the same referenced value, else will think it's a different one & not auto-populate existing dropdown value
    if(this.isLoggedIn && defaultLoc && (this.searchInfo.locationId == '' || this.searchInfo.locationId == defaultLoc.userLocationId)) {
        console.log("Setting search default location for user... ", defaultLoc.userLocationId);
        this.searchInfo.locationId = defaultLoc.userLocationId;
    }
  }

  private parseLocation() {
    const cityStatePostal: any = {};

    try {
      const postal = parseInt(this.searchInfo['location']);
      // Postal NOT an int? Use city/state
      if(Number.isNaN(postal)) {
        const parsedCityState = this.searchInfo['location'].split(',');
        cityStatePostal['city'] = parsedCityState[0];
        cityStatePostal['stateCode'] = (parsedCityState.length > 1 ? parsedCityState[1].trim() : '');
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
}
