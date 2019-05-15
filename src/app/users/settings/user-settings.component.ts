import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { Router }              from '@angular/router';
import { NgForm, FormControl } from '@angular/forms';
import { User, UserUpdates }   from "../user.model";
import { IconService }         from '../../core/services/icon.service';
import { AuthService }         from '../../core/auth/auth.service';
import { ApiUsersService }     from '../../core/api/api-users.service';
import { WishifiedsApi }       from '../../core/api/wishifieds-api.service';
import { NotificationService } from '../../core/services/notification.service';
import { ModalService }        from '../../core/services/modal.service';
import { MatInputModule }      from '@angular/material';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { Subscription, Subject } from 'rxjs';
import { Location } from '../../shared/models/location.model';

@Component({
  moduleId: module.id,
  selector: 'user-settings',
  templateUrl: 'user-settings.component.html',
  styleUrls:  ['user-settings.component.css']
})

export class UserSettingsComponent implements OnInit, AfterViewChecked {
  isConfirmed:    boolean;
  isProcessing:   boolean;
  emailWasResent = false;
  userSettingsForm: NgForm;
  @ViewChild('userSettingsForm') currentForm: NgForm;
  userSettings: UserUpdates;
  tempSettings: UserUpdates;
  // avatarImageFile: any = [];
  avatarUploader: FileUploader;
  userSub: Subscription;
  userEmit: Subject<any> = new Subject<any>();

  // NEED TO GET THESE & ALSO DEFINE Location
  userLocations: Location[] = [];
  userLocationsForm: NgForm;
  newUserLocation: any;
  userLocsSub: Subscription;
  userLocsEmit: Subject<any> = new Subject<any>();
  userLocsProcessing: Boolean = false;

  constructor(private icons:           IconService,
              private authService:     AuthService,
              private apiUsersService: ApiUsersService,
              private router:          Router,
              private notifService:    NotificationService,
              private modalService:    ModalService,
              private wishifiedsApi:   WishifiedsApi) {}

  ngOnInit() {
    const that = this;
    this.isProcessing = true;
    this.userSub = this.userEmit.subscribe((updatedUser: any) => {
      that.userSettings = {
        userId:   updatedUser.userId,
        username: updatedUser.email,
        email:    updatedUser.email,
        picUrl:   updatedUser.profilePicUrl,
        status:   null
      };
    });
    this.userLocsSub = this.userLocsEmit.subscribe((locsObj: any) => {
      if(locsObj.reset) {
        that.userLocations = locsObj['userLocs'];
      }
      else {
        that.userLocations = that.userLocations.concat(locsObj['userLocs']);
      }
    });

    this.apiUsersService.getUserById(this.authService.auth.userId)
                        .subscribe(
                          user => {
                            console.log("USER RETURNED FROM GET BY ID: ", user);
                            that.userEmit.next(user);
                            that.resetSettingsCopy();  // Prep the editable form;
                            that.isProcessing = false;
                            that.isConfirmed = that.setIsConfirmed(user.confirmed);
                          },
                          error => {
                            console.log("ERROR GETTING USER SETTINGS: ", error);
                          }
                        );

    // Avatar Uploading Stuff; maybe one-day a service that takes url & returns files
    const uploaderOptions: FileUploaderOptions = {};
    uploaderOptions.headers = [{name: 'eat', value: that.wishifiedsApi.getEatAuthCookie()}];
    console.log("Uploader options is: ", uploaderOptions);
    this.avatarUploader = new FileUploader({
      url: this.wishifiedsApi.buildUrl('updateProfilePic', [{':id': this.authService.auth.userId}]),
      itemAlias: 'avatar'
    });
    this.avatarUploader.setOptions(uploaderOptions);
    // Doesn't always load the Header!
    console.log("Uploader Options ARE: ", this.avatarUploader.options);
    this.avatarUploader.onAfterAddingFile = function(file) {file.withCredentials = false;};
    this.avatarUploader.onCompleteItem = function(item: any, response: any, status: any, headers: any) {
      console.log("ImageUpload:uploaded:", item, status, response);
      console.log("Response is: ", response);
      const user = JSON.parse(response).user;
      console.log("USER IS: ", user);
      that.userEmit.next(user);
    };
    this.resetSettingsCopy();
    this.resetNewUserLocation();
    this.userLocsProcessing = true;
    this.getUserLocations();
  }

  setIsConfirmed(value: string) {
    return value === 'true';
  }

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  resetNewUserLocation() {
    this.newUserLocation = { postal: '', description: '' };
  }

  getUserLocations() {
    const that = this;
    this.apiUsersService
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
    this.apiUsersService
      .createUserLocation(this.authService.auth.userId, this.newUserLocation)
      .subscribe(
        success => {
          console.log("Newly created user location result is: ", success);
          that.userLocsEmit.next({userLocs: that.newUserLocation, reset: false});
          that.resetNewUserLocation();
          this.userLocationsForm.form.markAsPristine();
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
    this.apiUsersService
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
    this.apiUsersService
        .deleteUserLocation(this.authService.auth.userId, userLocationId)
        .subscribe(
          success => {
            console.log("Successfully deleted user location with response: ", success);
            that.userLocations.splice(that.userLocations.findIndex(function(elem) {
              // Remove the deleted user location from UI list
              return elem.userLocationId == userLocationId;
            }), 1);
            that.userLocsEmit.next({userLocs: that.userLocations, reset: true});
            that.userLocationsForm.form.markAsPristine();
          },
          error => {
            console.log("Error deleting user location.");
            // TODO: BANNER THAT COULD NOT DELETE THE USER LCOATION
            console.log("PUT UP A BANNER TO NOTIFY COULD NOT DELETE!!");
          });
  }


  resendConfirmationEmail(event: any = null) {
    if(event) { event.preventDefault(); }
    const that = this;

    // Ensure there is an email before attempting to send
    if(!this.userSettings.email) {
      that.displayedValidationErrors['confirmation'] = that.validationErrorMessages.confirmation.email;
    }
    else {
      this.apiUsersService.resendUserConfirmation(this.userSettings.userId)
        .subscribe(
          success => {
            console.log("SUCCESS IN USER SETTINGS FOR RESEND CONFIRMATION IS: ", success);
            that.emailWasResent = true;
          },
          error => {
            console.log("ERROR IN USER SETTINGS FOR RESEND CONFIRMATION IS: ", error);
            that.notifService.notify('error', 'Confirmation email could not be sent. Please try again.', 8000);
          });
    }
  }

  // Save & Cancel Buttons
  save() {
    const that = this;
    this.tempSettings.userId = this.userSettings.userId;
    console.log("TEMP SETTINGS IS: ", this.tempSettings);
    console.log("USER SETTINGS IS: ", this.userSettings);

    if(this.userSettings.username !== this.tempSettings.username) {
      const warningTitle = 'Username & URL Address Change';
      const warningMsg   = 'Changing your username changes the address to your page. ' +
                           'Links using the old username will no longer work. ' +
                           'Are you sure you want to change your username?';
      console.log("STARTING MODAL NOW...");
      that.modalService
        .confirm(warningTitle, warningMsg)
        .subscribe((submit) => {
          if(submit.response === true) { updateUser(true); }
        });
    }
    else {
      console.log("UPDATING WITHOUT USERNAME CHANGE...");
      updateUser(false);
    }


    function updateUser(usernameChange: boolean = false) {
      that.apiUsersService.updateUser(that.tempSettings)
      .subscribe(
        success => {
          console.log("SUCCESS UPDATING THE USER IS: ", success);
          const user = success.user;
          const origEmail = that.userSettings.email;  // preserve orig email value
          const shouldReloadUser = (that.authService.auth.username !== user.username);
          // Reset userSettings to new values
          that.userSettings = Object.assign({}, that.tempSettings);
          // Reset auth cookies
          that.authService.setAuthCookies(that.authService.getEatAuthCookie(),
                                          user.username,
                                          user.userId,
                                          user.email,
                                          user.role);
          // Send confirmation email, if necessary
          if(that.didUpdateUnconfirmedEmail(origEmail, user.email)) { that.resendConfirmationEmail(); }
          // Updates notifications
          that.notifService.notify('success', 'Settings updates saved.');
          if(usernameChange) {
            const msg = 'Your username changed. Please remember, this has changed the address of your page. ' +
                        'If you have any existing links to your page around the interwebs, ' +
                        'they will no longer work until you update them to your new address (ie: with the new username).';
            that.notifService.notify('warning', msg, 12000);
          }
          // Redirect to new URL, if username changed (ie: url also changed)
          if(shouldReloadUser) { that.router.navigate([user.username, 'settings']); }
          // Check/update values otherwise
          that.setIsConfirmed(user.confirmed);
          that.resetFormDisplay();  // reset means turns off buttons
        },
        error => {
          console.log("ERROR IS: ", error);
          switch(error.json().msg) {
            case('username-taken'): return that.setUniquenessValidationError('username');
            case('email-taken'):    return that.setUniquenessValidationError('email');
            case('username-invalid'): {
              that.displayedValidationErrors['username'] = 'Sorry, this username is invalid. Please try another.';
            }
            case('email-format'): {
              that.displayedValidationErrors['email'] = 'Email does not appear valid. Please update and try again.';
              break;
            }
            default: {
              that.displayedValidationErrors['main'] = that.validationErrorMessages.main.generic;
              break;
            }
          }
        });
    }
  }

  cancel() {
    this.resetSettingsCopy();
    this.resetFormDisplay();
  }

  ngAfterViewChecked() {
    this.formChanged();
  }

  // ********** CONSIDER BREAKING OUT TO A SERVICE - SIMILIAR TO SIGNS *************
  // Resets the buttons that are triggered by changes
  private resetFormDisplay() {
    const controls = this.userSettingsForm.controls;
    Object.keys(controls).forEach(control => {
      controls[control].markAsPristine();
      controls[control].markAsUntouched();
    });
  }

  private resetSettingsCopy() {
    this.tempSettings = Object.assign({}, this.userSettings);  // Make a copy
  }

  private didUpdateUnconfirmedEmail(origEmail: string, newEmail: string) {
    // not confirmed & just updated email
    return (!this.isConfirmed && (origEmail !== newEmail) );
  }

  // ********** CUSTOM VALIDATIONS HERE - MAYBE BREAK INTO LIBRARY CLASS *************
  private setUniquenessValidationError(value) {
    this.displayedValidationErrors[value] = this.validationErrorMessages[value]['unique'];
  }

  displayedValidationErrors = {
    username: '',  // No message, when valid
    email: '',      // No message, when valid
    main: '',
    confirmation: '',
  };

  private validationErrorMessages = {
    username: {
      required: 'Username is required.',
      minlength: 'Username must be at least 2 characters long.',
      maxlength: 'Username cannot be more than 20 characters long.',
      unique: 'Username has already been taken. Please try another username.'
    },
    email: {
      required: 'Email is required.',
      minlength: 'Email must be at least 2 characters long.',
      structure: 'This did not pass our valid-email check. Please try another or contact us with the name that did not work.',
      unique: 'Email has already been taken. Please try another email.'
    },
    main: {
      generic: 'Settings could not be saved. Please try again.'
    },
    confirmation: {
      email: 'A valid email is required. Please update your email below before attempting to send.'
    }
  };

  private formChanged() {
    if(this.currentForm === this.userSettingsForm) { return; }  // No changes? Stop here.

    this.userSettingsForm = this.currentForm;  // Update the form with changes.

    if(this.userSettingsForm) {
      this.userSettingsForm.valueChanges.subscribe(data => this.onValueChanged(data));
    }
  }

  private onValueChanged(data?: any) {
    if(!this.userSettingsForm) { return; }  // if no form object, exit.
    const form = this.userSettingsForm.form;  // get the form

    for(const inputName in this.displayedValidationErrors) {
      // clear previous error messages
      this.displayedValidationErrors[inputName] = '';  // each error unser each inputName, clear it
      const control = form.get(inputName);            // get value from form input

      // If control inputName is dirtied & not valid, show all applicable errors
      if(control && control.dirty && !control.valid) {
        const msgs = this.validationErrorMessages[inputName];  // get all messages for inputName
        for(const error in control.errors) {
          this.displayedValidationErrors[inputName] += msgs[error] + ' ';
        }
      }
    }
  }
}
