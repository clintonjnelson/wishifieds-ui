import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
// import { WishifiedsApi } from '../../core/api/wishifieds-api.service';
// import { GeoInfo } from '../../shared/models/geo-info.model';
import { Subject, Subscription } from 'rxjs';
// import { FormBuilder, FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';   // Remove if no validation logic
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';  // USING EVENT??? IF NO, REMOVE IT. KEPT JUST IN CASE NEED DURING CODING.
import { ApiLocationsService }  from '../../core/api/api-locations.service';
import { ApiUsersService }  from '../../core/api/api-users.service';
import { Location } from '../../shared/models/location.model';


@Component({
  moduleId: module.id,
  selector: 'location-ta-marker-map',
  templateUrl: 'location-ta-marker-map.component.html',
  styleUrls:  ['location-ta-marker-map.component.css']
})

// This takes an optional user IN, and returns the info on a selected/chosen location
export class LocationTAMarkerMapComponent implements OnInit, OnDestroy {
  @ViewChild('mapDiv') mapCont;
  @Input() userId: string;  // Typically used to get the user's default location, for direct or fallback
  @Input() providedLocation: Location;  // Typically used for finer-grained locations, like on a listing
  @Input() isMarkerDraggable: boolean = true;  // Makes map updatable
  @Output() locationEE = new EventEmitter<any>();  // Bubbling up new location on marker drag/drop

  location: any;  // This field is the purpose of this feature
  userLocations: any;
  defaultUserLocation: any;  // Stores the user's default location
  userLocationsSub: Subscription;
  userLocationsEmit: Subject<any> = new Subject<any>();

  locationTASearch: string = '';  // The search string for the typeahead
  locationTAId: string = '';
  locationTypeaheads: any[];
  locTypeaheadSub: Subscription;
  locTypeaheadEmit: Subject<any[]> = new Subject<any[]>();

  // displayedValidationErrors: any = {location: ''}


  constructor(private locationService: ApiLocationsService,
              private apiUsers:        ApiUsersService) {}

  // TODO:  CREATE A MAPS SERVICE THAT USES THE ROUTE & CAN DO MOST OF THESE ACTIONS EASILY VIA FUNCTION
  ngOnInit() {
    const that = this;

    // Gets UserLocations and updates default user location per the response
    this.userLocationsSub = this.userLocationsEmit.subscribe((updates: any) => {
      that.userLocations = updates.userLocations;  // These are the queried user userLocations for dropdown selector
      that.defaultUserLocation = updates.userLocations.find(function(loc) { return loc.isDefault; });

      if(!that.location && updates.setLocation) {
        that.location = that.defaultUserLocation;
      }
    });
    this.locTypeaheadSub = this.locTypeaheadEmit.subscribe( (newTypeaheads: any[]) => {
      console.log("SETTING TYPEAHEAD Locations: ", newTypeaheads);
      that.locationTypeaheads = newTypeaheads;
      console.log("TYPEAHEADS IS NOW", this.locationTypeaheads);
    });

    this.setLocation();
    // Create the map & marker
  }

  ngOnDestroy() {
    this.userLocationsSub.unsubscribe();
    this.locTypeaheadSub.unsubscribe();
  }

  // toggleHint(hint: string) {
  //   console.log("HINTS IS: ", this.hints);
  //   console.log("HINT IS: ", hint);
  //   console.log("HAS OWN PROPERTY ON HINT IS: ", this.hints.hasOwnProperty(hint));
  //   if(this.hints.hasOwnProperty(hint)) {
  //     this.hints[hint] = !this.hints[hint];
  //   }
  // }

  // Used to set the initial location value for the map.
  // First, passed location
  // Second, default userLocation
  // Third, Standard default location
  setLocation() {
    // Falls back to to Seattle
    const fallbackLocation: Location = {
      locationId: "38512",
      geoInfo: { latitude: 47.6114, longitude: -122.3305 },
      description: '',
      postal: undefined,
      status: undefined,
      isDefault: undefined,
    };

    if(this.providedLocation) {
      this.location = this.providedLocation
      this.getUserLocationsAndSetLocation(this.userId, false);
    }
    else if(this.userId && !this.location) {
      this.getUserLocationsAndSetLocation(this.userId, true);
    }
    else if(this.userId) {
      this.getUserLocationsAndSetLocation(this.userId, false);
    }
    else if(!this.location){
      this.location = fallbackLocation;
    }
  }

  getUserLocationsAndSetLocation(id, setLocation) {
    const that = this;
    if(id) {
      this.apiUsers.getLocationsByUserId(id)
        .subscribe(
          res => {
            // console.log("Respons with userLocations returned is: ", res);
            console.log("Respons with userLocations returned is: ", res.locations);
            that.userLocationsEmit.next({userLocations: res.locations, setLocation: setLocation});  // May need subscription for different load times....
          },
          error => {
            console.log("ERROR GETTING LOCATIONS: ", error);
          }
        )
    }
  }

  // TODO: EXTRACT THESE OUT TO A SINGLE COMPONENT FOR LOCATION TYPEAHEAD
  getLocationTypeaheads() {
    const that = this;
    var cityStatePostal = this.parseLocation(); // {postal: '', city: '', stateCode: ''};

    console.log("INPUT TRIGGERED TYPEAHEAD CHANGES TO GET NEW RESULTS: ", cityStatePostal);
    if(this.locationTASearch.length > 2) {
      const maxResults = '7';
      this.locationService
        .locationTypeahead(cityStatePostal['postal'], cityStatePostal['city'], cityStatePostal['stateCode'], maxResults)
        .subscribe(
          results => {
            console.log("SUCCESS GETTING TYPEAHEAD RESULTS: ", results);
            that.locTypeaheadEmit.next(results.locations);
          },
          error => {
            console.log("ERROR GETTING TYPEAHEAD RESULTS: ", error);
          });
    }
  }
  selectLocationTA(event) {
    const that = this;
    // Only reload with changes AFTER initial search
    const selectedTypeahead = this.locationTypeaheads.find(function(ta) {
        return (ta['id'] == (event['option'] && event['option']['value']));  //
      });  // get the geoInfo object off of the result. Worst case is null.
    if(selectedTypeahead && selectedTypeahead['geoInfo']) {
      this.location = {
        locationId: selectedTypeahead['id'],
        description: '',
        postal: selectedTypeahead['postal'],
        status: undefined,
        isDefault: undefined,
        geoInfo: {
          latitude: selectedTypeahead['geoInfo'][0],
          longitude: selectedTypeahead['geoInfo'][1],
        }
      };
      this.locationEE.next(this.location);
      this.locationTASearch = selectedTypeahead['typeaheadText'];
    }
  }

  updateLocationViaMarker(geoInfo) {
    console.log("UPDATE LOCATION COORDS WAS HIT WITH: ", geoInfo);
    this.location = {
      locationId: "-1",  // Set to invalid, so API triggers creation of new Location
      description: '',
      postal: undefined,
      status: undefined,
      isDefault: undefined,
      geoInfo: {
        latitude: geoInfo.lat,
        longitude: geoInfo.lng,
      }
    };
    this.locationTASearch = '';  // reset the textbox
    this.locationEE.next(this.location);
  }

  private parseLocation() {
    const cityStatePostal: any = {};

    try {
      const postal = parseInt(this.locationTASearch);
      // Postal NOT an int? Use city/state
      if(Number.isNaN(postal)) {
        const parsedCityState = this.locationTASearch.split(',');
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
