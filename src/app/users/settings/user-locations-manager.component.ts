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

export class UserLocationsManagerComponent implements OnInit {
  @ViewChild('userLocationsForm') userLocationsForm: NgForm;
  userLocations: UserLocation[] = [];
  newUserLocation: any;
  isEditingUserLocations = false;
  userLocsSub: Subscription;
  userLocsEmit: Subject<any> = new Subject<any>();
  userLocsProcessing: Boolean = false;

  constructor(private icons:           IconService,
              private authService:     AuthService,
              private apiUsersLocationsService: ApiUsersLocationsService,
              private router:          Router,
              private notifService:    NotificationService,
              private wishifiedsApi:   WishifiedsApi) {}

  ngOnInit() {
    const that = this;
    this.userLocsSub = this.userLocsEmit.subscribe((locsObj: any) => {
      if(locsObj.reset) {
        that.userLocations = locsObj['userLocs'];
      }
      else {
        that.userLocations = that.userLocations.concat(locsObj['userLocs']);
      }
    });
    this.resetNewUserLocation();
    this.userLocsProcessing = true;
    this.getUserLocations();
  }

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  resetNewUserLocation() {
    this.newUserLocation = { postal: '', description: '' };
  }

  toggleEditingUserLocations() {
    this.isEditingUserLocations = true;
  }

  getUserLocations() {
    const that = this;
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

  createUserLocation() {
    const that = this;
    console.log("About to create user location...");
    this.apiUsersLocationsService
      .createUserLocation(this.authService.auth.userId, this.newUserLocation)
      .subscribe(
        success => {
          console.log("Newly created user location result is: ", success);
          that.userLocsEmit.next({userLocs: that.newUserLocation, reset: false});
          that.resetNewUserLocation();
          this.userLocationsForm.reset();
        },
        error => {
          console.log("SHOULD USE STATUS FOR LOGIC. ERROR AVAIL IS: ", error);
          switch(error.json().msg) {
            case('not-found'): console.log("MAKE COMPONENT WITH OWN ERRORS FOR THIS...");
          }
          console.log("Error creating new user location: ", error);
        });
  }

  setDefaultUserLocation(userLocationId) {
    const that = this;
    console.log("About to set user location as default...", userLocationId);
    this.apiUsersLocationsService
      .setDefaultUserLocation(this.authService.auth.userId, userLocationId)
      .subscribe(
        success => {
          console.log("Newly created user location result is: ", success);
          console.log("USER LOCATIONS BEFORE UPDATE IS:", that.userLocations);
          const updatedUserLocs = that.userLocations.map(function(usrloc) {
            let copyUserLoc = Object.assign({}, usrloc);
            // Deactivate old default
            if(usrloc.isDefault) {
              copyUserLoc['isDefault'] = false;
            }
            // Activate new default
            if(usrloc.userLocationId == userLocationId) {
              copyUserLoc['isDefault'] = true;
            }

            return copyUserLoc;
          });
          console.log("USER LOCATIONS AFTER UPDATE IS:", updatedUserLocs);
          that.userLocsEmit.next({userLocs: updatedUserLocs, reset: true});
        },
        error => {
          console.log("SHOULD USE STATUS TO HANDLE THIS ERROR CODE. See below for hint. ERROR AVAIL IS: ", error);
          switch(error.json().msg) {
            case('not-found'): console.log("MAKE COMPONENT WITH OWN ERRORS FOR THIS...");
          }
          console.log("Error creating new user location: ", error);
        });
  }

  deleteUserLocation(userLocationId) {
    const that = this;
    console.log("about to DELETE user location: ", userLocationId);
    this.apiUsersLocationsService
        .deleteUserLocation(this.authService.auth.userId, userLocationId)
        .subscribe(
          success => {
            console.log("Successfully deleted user location with response: ", success);
            that.userLocations.splice(that.userLocations.findIndex(function(elem) {
              // Remove the deleted user location from UI list
              return elem.userLocationId == userLocationId;
            }), 1);
            that.userLocsEmit.next({userLocs: that.userLocations, reset: true});
          },
          error => {
            console.log("Error deleting user location.");
            // TODO: BANNER THAT COULD NOT DELETE THE USER LCOATION
            console.log("PUT UP A BANNER TO NOTIFY COULD NOT DELETE!!");
          });
  }
}
