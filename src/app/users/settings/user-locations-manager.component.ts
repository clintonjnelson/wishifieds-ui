import { Component, OnInit, ViewChild } from '@angular/core';
import { Router }              from '@angular/router';
import { NgForm, FormControl } from '@angular/forms';
import { IconService }         from '../../core/services/icon.service';
import { AuthService }         from '../../core/auth/auth.service';
import { ApiUsersLocationsService } from '../../core/api/api-users-locations.service';
import { WishifiedsApi }       from '../../core/api/wishifieds-api.service';
import { NotificationService } from '../../core/services/notification.service';
import { MatInputModule }      from '@angular/material';
import { Subscription, Subject } from 'rxjs';
import { UserLocation } from '../../shared/models/location.model';

@Component({
  moduleId: module.id,
  selector: 'user-locations-manager',
  templateUrl: 'user-locations-manager.component.html',
  styleUrls:  ['user-locations-manager.component.css']
})

// This manages the default location for a user
// Technically, multiple locations are supported for users, but the initial implementation
//     is only to manage the user's default location. The type of locations managed
//     here are "USER" type locations, as opposed to "LISTING" type which are directly
//     created for the purpose of a listing & are owned solely by the listing.
//     "USER" locations can be applied to many things (it's the default for a listing),
//     but it owned & manged at the user level - meaning it will change the location
//     of all listings that use it, if the USER location itself is changed.
// Management happens from this level & lower - nothing is passed up beyond
// The child map & search will pass into up to this component for handling in the updating

// Need
    // 1. Management for ONLY user default location
    // 2. Confirmation modal that changing this will change the location for all listings that use it.




export class UserLocationsManagerComponent implements OnInit {
  @ViewChild('userLocationsForm') userLocationsForm: NgForm;
  userLocations: UserLocation[] = [];
  tempUserLocation: any;  // This is the TEMP one we're creating... MAY NOT NEED THIS SINCE JUST WON"T UPDATE IF CANCEL IT.
  existingDefaultUserLocation: any;  // This is the current one before updating
  isEditingUserLocations = false;
  userLocsSub: Subscription;
  userLocsEmit: Subject<any> = new Subject<any>();
  userLocsProcessing: Boolean = false;
  userId: string;

  constructor(private icons:           IconService,
              private authService:     AuthService,
              private apiUsersLocationsService: ApiUsersLocationsService,
              private router:          Router,
              private notifService:    NotificationService,
              private wishifiedsApi:   WishifiedsApi) {}

  ngOnInit() {
    const that = this;
    // TODO: Use observable  for this value
    this.userId = this.authService.auth.userId;

    this.userLocsSub = this.userLocsEmit.subscribe((locsObj: any) => {
      that.userLocations = locsObj['userLocs'];
      that.existingDefaultUserLocation = locsObj['userLocs'].find(function(loc) { return loc.isDefault; });
      that.resetTempUserLocation();
      // if(locsObj.reset) {
      //   that.userLocations = locsObj['userLocs'];
      // }
      // else {
      //   that.userLocations = that.userLocations.concat(locsObj['userLocs']);
      // }
    });

    this.getUserLocations();
  }

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  resetTempUserLocation() {
    this.tempUserLocation = Object.assign({}, this.existingDefaultUserLocation);  // Copy into temp, triggering via new reference
    //this.tempUserLocation = { postal: '', description: '' };
  }

  toggleEditingUserLocations() {
    this.isEditingUserLocations = true;
  }

  // Listener for event payload from child component; receives a Location object (NOT UserLocation) to update on User;
  // This will update for existing location for user, or create/associate a new location to the user
  updateDefaultUserLocation(event: Location) {
    console.log("Updated location coming down!", event);
    // Need to:
      // 1) create a new location
      // 2) replace the location for the user's default UserLocation
    this.apiUsersLocationsService
        .updateUserDefaultLocation(this.authService.auth.userId, event)
        .subscribe(
          success => {
            console.log("Newly updates user default location is: ", success);
            // Make a get request to update the map after update? => FLASHES PAGE UNNERVINGLY
          }),
          error => {
            console.log("Failed to update the user's default location. Error is: ", error);
            this.getUserLocations();
            // Make a separate generic service to message about errors in a consistent way?
              // Maybe like a hash of generic messages with string-sub for resource/etc.
          }
  }

  getUserLocations() {
    const that = this;
    this.userLocsProcessing = true;
    this.apiUsersLocationsService
        .getLocationsByUserId(this.authService.auth.userId)
        .subscribe(
          res => {
            console.log("Retrieved user locations: ", res.locations);
            that.userLocsEmit.next({userLocs: res.locations, reset: true});
            that.userLocsProcessing = false;
          },
          error => {
            console.log("Error retrieving user locations: ", error);
            that.userLocsProcessing = false;
          });
  }


  // createUserLocation() {
  //   const that = this;
  //   console.log("About to create user location...");
  //   this.apiUsersLocationsService
  //     .createUserLocation(this.authService.auth.userId, this.tempUserLocation)
  //     .subscribe(
  //       success => {
  //         console.log("Newly created user location result is: ", success);
  //         that.userLocsEmit.next({userLocs: that.tempUserLocation, reset: false});
  //         that.resetNewUserLocation();
  //         this.userLocationsForm.reset();
  //       },
  //       error => {
  //         console.log("SHOULD USE STATUS FOR LOGIC. ERROR AVAIL IS: ", error);
  //         switch(error.json().msg) {
  //           case('not-found'): console.log("MAKE COMPONENT WITH OWN ERRORS FOR THIS...");
  //         }
  //         console.log("Error creating new user location: ", error);
  //       });
  // }

  // setDefaultUserLocation(userLocationId) {
  //   const that = this;
  //   console.log("About to set user location as default...", userLocationId);
  //   this.apiUsersLocationsService
  //     .setDefaultUserLocation(this.authService.auth.userId, userLocationId)
  //     .subscribe(
  //       success => {
  //         console.log("Newly created user location result is: ", success);
  //         console.log("USER LOCATIONS BEFORE UPDATE IS:", that.userLocations);
  //         const updatedUserLocs = that.userLocations.map(function(usrloc) {
  //           let copyUserLoc = Object.assign({}, usrloc);
  //           // Deactivate old default
  //           if(usrloc.isDefault) {
  //             copyUserLoc['isDefault'] = false;
  //           }
  //           // Activate new default
  //           if(usrloc.userLocationId == userLocationId) {
  //             copyUserLoc['isDefault'] = true;
  //           }

  //           return copyUserLoc;
  //         });
  //         console.log("USER LOCATIONS AFTER UPDATE IS:", updatedUserLocs);
  //         that.userLocsEmit.next({userLocs: updatedUserLocs, reset: true});
  //       },
  //       error => {
  //         console.log("SHOULD USE STATUS TO HANDLE THIS ERROR CODE. See below for hint. ERROR AVAIL IS: ", error);
  //         switch(error.json().msg) {
  //           case('not-found'): console.log("MAKE COMPONENT WITH OWN ERRORS FOR THIS...");
  //         }
  //         console.log("Error creating new user location: ", error);
  //       });
  // }

  // deleteUserLocation(userLocationId) {
  //   const that = this;
  //   console.log("about to DELETE user location: ", userLocationId);
  //   this.apiUsersLocationsService
  //       .deleteUserLocation(this.authService.auth.userId, userLocationId)
  //       .subscribe(
  //         success => {
  //           console.log("Successfully deleted user location with response: ", success);
  //           that.userLocations.splice(that.userLocations.findIndex(function(elem) {
  //             // Remove the deleted user location from UI list
  //             return elem.userLocationId == userLocationId;
  //           }), 1);
  //           that.userLocsEmit.next({userLocs: that.userLocations, reset: true});
  //         },
  //         error => {
  //           console.log("Error deleting user location.");
  //           // TODO: BANNER THAT COULD NOT DELETE THE USER LCOATION
  //           console.log("PUT UP A BANNER TO NOTIFY COULD NOT DELETE!!");
  //         });
  // }
}
