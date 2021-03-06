import { Component, OnInit, ViewChild, AfterViewChecked, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm, FormControl } from '@angular/forms';
import { User, UserUpdates }   from "../user.model";
import { IconService }         from '../../core/services/icon.service';
import { AuthService, UserAuth } from '../../core/auth/auth.service';
import { ApiUsersService }     from '../../core/api/api-users.service';
import { ApiOauthService }     from '../../core/api/api-oauth.service';
import { WishifiedsApi }       from '../../core/api/wishifieds-api.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConfirmModalService } from '../../shared/confirm-modal/confirm-modal.service';
import { MatInputModule, MatTabChangeEvent } from '@angular/material';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { Subscription, Subject } from 'rxjs';

@Component({
  moduleId: module.id,
  selector: 'user-settings',
  templateUrl: 'user-settings.component.html',
  styleUrls:  ['user-settings.component.css']
})

export class UserSettingsComponent implements OnInit, AfterViewChecked, OnDestroy {
  auth: UserAuth;
  authSubscription: Subscription;
  isOwner = false;
  isConfirmed:    boolean;
  isProcessing:   boolean;
  emailWasResent = false;
  userSettingsForm: NgForm;
  @ViewChild('userSettingsForm') currentForm: NgForm;
  userSettings: UserUpdates;
  tempSettings: UserUpdates;
  avatarUploader: FileUploader;
  userSub: Subscription;
  userEmit: Subject<any> = new Subject<any>();
  badges: any = {};

  // Page Tabs
  pageSubscription: Subscription;
  tabsSubscription: Subscription;
  usernameFromRoute: string;
  currentTabIndex: number;
  tabMap = ['profile', 'locations', 'credibility'];

  constructor(private icons:           IconService,
              private authService:     AuthService,
              private apiUsersService: ApiUsersService,
              private apiOauthService: ApiOauthService,
              private route:           ActivatedRoute,
              private router:          Router,
              private notifService:    NotificationService,
              private modalService:    ConfirmModalService,
              private wishifiedsApi:   WishifiedsApi) {

    // Subscribe to the auth service, so stay updated on changes
    this.auth = authService.auth;
    this.authSubscription = authService.userAuthEmit.subscribe((newVal: UserAuth) => {
      this.auth = newVal;
    });
  }

  ngOnInit() {
    const that = this;
    this.badges = {};
    this.isProcessing = true;

    // Maintain user settings info
    this.userSub = this.userEmit.subscribe((updatedUser: any) => {
      console.log("Updating user with newly retrieved user info: ", updatedUser);
      that.userSettings = {
        userId:   updatedUser.userId,
        username: updatedUser.email,
        email:    updatedUser.email,
        picUrl:   updatedUser.profilePicUrl,
        status:   null
      };
      that.loadBadges(updatedUser);
    });
    this.getUserForSettings();

    // Validate Owner via Unique username (if username changes, this updates the routeParams)
    this.pageSubscription = this.route.params.subscribe( (params: Params) => {
      const username = params['username'];
      console.log("TRIGGERED SUBSCRIPTION THAT WATCHES PARAMS: ", params);
      that.updateUsernameBasedData(username);
    });

    // Update the page tab based on the URL specified tab
    this.tabsSubscription = this.route.queryParams.subscribe( params => {
      let tabName = params['tab'];
      if(!!tabName) {
        let tabIndex = that.tabMap.indexOf(tabName);
        that.currentTabIndex = tabIndex;
      }
    });

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
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.authSubscription.unsubscribe();
    this.pageSubscription.unsubscribe();
    this.tabsSubscription.unsubscribe();
  }

  setCurrentTab(event: MatTabChangeEvent) {
    const tab = this.tabMap[event.index];
    this.updateExistingUrl(tab)
  }

  setIsConfirmed(value: string) {
    return value === 'true';
  }

  buildIconClass(icon: string, size: string = '2', fontType: string = 's') {
    return this.icons.buildIconClass(icon, size, fontType);
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

  getUserForSettings() {
    const that = this;
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
                                          user.role,
                                          user.profilePicUrl);
          // Send confirmation email, if necessary
          if(that.didUpdateUnconfirmedEmail(origEmail, user.email)) { that.resendConfirmationEmail(); }
          // Updates notifications
          that.notifService.notify('success', 'Settings updates saved.');
          if(usernameChange) {
            const msg = 'Your username changed. Please remember, this has changed the web address url of your page. ' +
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

  loadBadges(userInfo) {
    const that = this;
    this.badges = {};
    try {
      const badges = userInfo['badges'].forEach(function(badge) {
        that.badges[badge.badgeType] = {
            badgeType: badge.badgeType,
            linkUrl: badge.linkUrl
          };
      });
      console.log("Success loading badges: ", that.badges);
    } catch (e) { console.log("Error loading badges: ", e); }
  }

  attemptAddBadge(badgeType: string) {
    console.log("MADE IT TO FB VALIDATION FUNCTION...");
    this.apiOauthService.oauthProviderRedirect(badgeType);
    console.log("THE REQUEST WILL NOT COME BACK HERE, BUT WILL BE REDIRECTED VIA OAUTH");
  }

  removeBadge(badgeType: string) {
    const that = this;
    console.log("MADE IT TO FB BADGE REMOVAL FUNCTION...");
    this.apiUsersService.deleteBadge(this.authService.auth.userId, badgeType)
      .subscribe(
        success => {
          console.log("SUCCESS DELETING BADGE: ", success);
          let successMsg = 'We have removed your Facebook credibility badge & all of your facebook credibility info.'
          that.notifService.notify('success', successMsg);
          that.getUserForSettings();
        },
        error => {
          console.log("ERROR removing badge for ", badgeType, '. Error: ', error);
          const errorMsg = 'Oops, something went wrong when attempting to remove your badge. ' +
            'Please try again (now or later). ' +
            'If that doesnt work, please refresh the page, just in case it was successful but lost in translation.'
          that.notifService.notify('error', errorMsg);
        }
      );
  }

  cancel() {
    this.resetSettingsCopy();
    this.resetFormDisplay();
  }

  ngAfterViewChecked() {
    this.formChanged();
  }

  // ********** CONSIDER BREAKING OUT TO A SERVICE - SIMILIAR TO SIGNS *************
  private updateUsernameBasedData(username: string) {
    this.usernameFromRoute = username;
    console.log("Username from route is: ", this.usernameFromRoute);

    this.isOwner = this.authService.isOwner(this.usernameFromRoute);
    console.log("ISOWNER IS: ", this.isOwner);
  }

  // Ensures tab name alignment
  private updateExistingUrl(tab: string) {
    if(window.history.pushState) {
      const updatedTabUrl = window.location.protocol + '//' +  // https://
                             window.location.host +             // www.wishifieds.com
                             window.location.pathname +         // /
                             '?tab=' + tab;  // ?searchQuery=Superman
      // Update the existing history
      window.history.pushState({path: updatedTabUrl}, '', updatedTabUrl);
    }

    // Trigger resize to fix map only displaying one tile due to hidden tab; reloads map.
    if(tab == "locations") {
      window.dispatchEvent(new Event('resize'));
    }
  }

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
