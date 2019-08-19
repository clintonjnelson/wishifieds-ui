import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router }              from '@angular/router';
import { NgForm, FormControl } from '@angular/forms';
import { IconService }         from '../../core/services/icon.service';
import { AuthService }         from '../../core/auth/auth.service';
import { ApiUsersLocationsService } from '../../core/api/api-users-locations.service';
import { WishifiedsApi }       from '../../core/api/wishifieds-api.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConfirmModalService } from '../../shared/confirm-modal/confirm-modal.service';
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


export class UserLocationsManagerComponent implements OnInit, OnDestroy {
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
              private wishifiedsApi:   WishifiedsApi,
              private modalService:    ConfirmModalService,
              private notificationService: NotificationService) {}

  ngOnInit() {
    const that = this;
    // TODO: Use observable  for this value
    this.userId = this.authService.auth.userId;

    this.userLocsSub = this.userLocsEmit.subscribe((locsObj: any) => {
      that.userLocations = locsObj['userLocs'];
      that.existingDefaultUserLocation = locsObj['userLocs'].find(function(loc) { return loc.isDefault; });
      that.resetTempUserLocation();
    });

    this.getUserLocations();
  }

  ngOnDestroy() {
    this.userLocsSub.unsubscribe();
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
    const that = this;
    console.log("Updated location coming down!", event);

    const warningTitle = 'NOTICE: Default Location Change Can Effect Listings';
    const warningMsg   = 'Changes to your default location will be reflected on the location for ALL listings that use it (the default when creating a listing). ' +
                         'Are you sure you want to change your default location?';
    console.log("STARTING MODAL NOW...");

    this.modalService
      .confirm(warningTitle, warningMsg)
      .subscribe((submit) => {
        if(submit.response === true) {
          that.apiUsersLocationsService
              .updateUserDefaultLocation(that.authService.auth.userId, event)
              .subscribe(
                success => {
                  console.log("Newly updates user default location is: ", success);
                  that.notificationService.notify('success', 'Your default location has been updated everywhere.', 4000);
                  // Make a get request to update the map after update? => FLASHES PAGE UNNERVINGLY
                }),
                error => {
                  console.log("Failed to update the user's default location. Error is: ", error);
                  that.getUserLocations();
                  // Make a separate generic service to message about errors in a consistent way?
                    // Maybe like a hash of generic messages with string-sub for resource/etc.
                }
        }
      });
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
}
