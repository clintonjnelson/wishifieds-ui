import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { User, UserSettings }        from "../user.model";
import { HelpersService }      from '../../shared/helpers/helpers.service';
import { AuthService }         from '../../core/auth/auth.service';
import { ApiUsersService }     from '../../core/api/api-users.service';
// import { UniqueValidatorDireceive } from '../../shared/validators/unique.directive';

@Component({
  moduleId: module.id,
  selector: 'user-settings',
  templateUrl: 'user-settings.component.html',
  styleUrls:  ['user-settings.component.css']
})

export class UserSettingsComponent implements OnInit {
  isProcessing: boolean;
  userSettingsForm: NgForm;
  @ViewChild('userSettingsForm') currentForm: NgForm;
  userSettings: UserSettings;
  tempSettings: UserSettings;

  constructor(private helpers:         HelpersService,
              private authService:     AuthService,
              private apiUsersService: ApiUsersService) {}

  ngOnInit() {
    const that = this;
    this.isProcessing = true;
    console.log("AUTH OBJECT IS: ", this.authService.auth);
    this.apiUsersService.getUserById(this.authService.auth.userId)
                        .subscribe(
                          user => {
                            console.log("USER RETURNED FROM GET BY ID: ", user);
                            that.userSettings = {
                              userId: user.userId,
                              username: user.username,
                              email: user.email,
                              picUrl: null,   // UPDATE THESE
                              status: null};  // UPDATE THESE
                            that.resetSettingsCopy();  // Prep the editable form;
                            that.isProcessing = false;
                          },
                          error => {
                            console.log("ERROR GETTING USER SETTINGS: ", error);
                          }
                        );
    that.resetSettingsCopy();
  }

  // Save & Cancel Buttons
  save() {
    var that = this;
    this.tempSettings.userId = this.userSettings.userId;
    console.log("TEMP SETTINGS IS: ", this.tempSettings);
    console.log("USER SETTINGS IS: ", this.userSettings);

    this.apiUsersService.updateUser(this.tempSettings)
      .subscribe(
        success => {
          console.log("SUCCESS UPDATING THE USER IS: ", success);
          this.userSettings = Object.assign({}, that.tempSettings);
          this.resetFormDisplay();  // reset means turns off buttons
        },
        error => {
          console.log("ERROR IS: ", error);
          switch(error.msg) {
            case('username'): return that.setUniquenessValidationError('username');
            case('email'):    return that.setUniquenessValidationError('email');
            case('email-format'): {
              that.displayedValidationErrors['email'] = 'Email does not appear valid. Please update and try again.'
              break;
            }
            default: {
              that.displayedValidationErrors['main'] = that.validationErrorMessages.main.generic
              break;
            }
          }
          console.log("ERROR UPDATING THE USER IS: ", error);
        });
  }

  cancel() {
    this.resetSettingsCopy();
    this.resetFormDisplay();
  }


  // ********** CONSIDER BREAKING OUT TO A SERVICE - SIMILIAR TO SIGNS *************
  // Resets the buttons that are triggered by changes
  private resetFormDisplay() {
    var controls = this.userSettingsForm.controls;
    Object.keys(controls).forEach(control => {
      controls[control].markAsPristine();
      controls[control].markAsUntouched();
    });
  }

  private resetSettingsCopy() {
    this.tempSettings = Object.assign({}, this.userSettings);  // Make a copy
  }

  // ********** CUSTOM VALIDATIONS HERE - MAYBE BREAK INTO LIBRARY CLASS *************
  private setUniquenessValidationError(value) {
    this.displayedValidationErrors[value] = this.validationErrorMessages[value]['unique'];
  }

  displayedValidationErrors = {
    username: '',  // No message, when valid
    email: '',      // No message, when valid
    main: ''
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
    }
  }

  ngAfterViewChecked() {
    this.formChanged();
  }

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
