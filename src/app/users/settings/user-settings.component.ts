import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { UserSettings } from "../user.model";
import { HelpersService } from '../../shared/helpers/helpers.service';
// import { UniqueValidatorDireceive } from '../../shared/validators/unique.directive';

@Component({
  moduleId: module.id,
  selector: 'user-settings',
  templateUrl: 'user-settings.component.html',
  styleUrls:  ['user-settings.component.css']
})

export class UserSettingsComponent implements OnInit {
  userSettingsForm: NgForm;
  @ViewChild('userSettingsForm') currentForm: NgForm;
  userSettings: UserSettings;
  tempSettings: UserSettings;

  constructor(private helpers: HelpersService) {}

  ngOnInit() {
    // GET THE USER SETTINGS FROM API. IF ALREADY HAVE, THEN REMOVE NG_ON_INIT
    this.userSettings = {picUrl: '', username: 'adminuser', email: 'admin@example.com', status: 'active'};
    this.resetSettingsCopy();
  }

  // Save & Cancel Buttons
  save() {
    var _this = this;
    // RUN VALIDATIONS FIRST -- SHOW ERRORS IF ANY FOUND
    // CHECK FOR INVALID USERNAME -- ALREADY TAKEN OR OTHERWISE
    // IF NO ERRORS, ATTEMPT TO SAVE THE USER SETTINGS UPDATE
    // SAVE
        // If saves, update the original AND the copy
        // If fails to save, DO NOT UPDATE ANYTHING. Allow user to fix.
    // Finally, reset the form display (turns off buttons)
    this.userSettings = Object.assign({}, _this.tempSettings);
    this.resetFormDisplay();
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
  displayedValidationErrors = {
    username: '',  // No message, when valid
    email: ''      // No message, when valid
  };

  private validationErrorMessages = {
    username: {
      required: 'Username is required.',
      minlength: 'Username must be at least 2 characters long',
      maxlength: 'Username cannot be more than 20 characters long',
      unique: 'Username has already been taken. Please try another username.'
    },
    email: {
      required: 'Email is required.',
      minlength: 'Email must be at least 2 characters long',
      structure: 'This did not pass our valid-email check. Please try another or contact us with the name that did not work',
      unique: 'Email has already been taken. Please try another email.'
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
