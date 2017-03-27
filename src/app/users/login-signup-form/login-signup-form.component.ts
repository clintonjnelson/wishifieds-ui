import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ApiUsersService } from '../../core/api/api-users.service';
import { ApiAuthService } from '../../core/api/api-auth.service';
import { UserCreds } from '../../users/user.model';
import { NotificationService } from '../../core/services/notification.service';



const EMAIL_REGEX = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

@Component({
  moduleId: module.id,
  selector: 'login-signup-form',
  templateUrl: 'login-signup-form.component.html',
  styleUrls:  ['login-signup-form.component.css']
})


export class LoginSignupFormComponent {
  emailRegex: RegExp = EMAIL_REGEX;
  loginForm: NgForm;
  @ViewChild('loginForm') currentForm: NgForm;
  @Output() close = new EventEmitter<any>();
  userCreds: UserCreds;

  constructor( private authService:     AuthService,
               private apiUsersService: ApiUsersService,
               private apiAuthService:  ApiAuthService,
               private router:          Router,
               private notification:    NotificationService) {
    this.userCreds = {
      email:      '',
      password:   '',
      newAccount: false,
      termsCond:  null
    };
  };

  loginOrSignup(event: any): boolean {
    event.preventDefault();  // Do not redirect.
    const that = this;
    console.log("LOGIN CLICKED");
    console.log("LOGIN FORM IS: ", this.loginForm);
    console.log("USER CREDS IS: ", this.userCreds);
    console.log("CALLING LOGIN ON AUTHSERVICE WITH EMAIL, PASSWORD...");
    if(!this.loginForm.form.valid) { return; } // Invalid, do nothing

    if(this.userCreds.newAccount) {
      if(this.userCreds.termsCond) {
        this.apiUsersService.createUser(this.userCreds)
          .subscribe(
            res => {
              console.log("RESPONSE TO SIGNUP FORM IS: ", res);
              that.authService.setAuthCookies(res.eat, res.username, res.userid, res.email, res.role);
              that.notification.notify('success', 'Welcome! We\'ve staked you a new post so you can hang some signs.');
              this.close.emit(null);
              that.router.navigate(['/', res.username]);
            },
            err => {
              let body = err.json();
              console.log("ERROR TO HANDLE FINAL IS: ", body);
              if(body.error === 'username') {
                console.log("SHOWING FORM ERROR NOW...");
                that.displayedValidationErrors['main'] += that.validationErrorMessages.email.taken;
              }
              console.log("ERROR RESPONSE TO SIGNUP FORM IS: ", body);
            }
          );
      }
    }
    else {
      this.login(this.userCreds.email, this.userCreds.password);
    }
    return false;
  }

  login(email: string, password: string) {
    const that = this;
    var encodedCreds = window.btoa(email + ':' + password);
    console.log("ABOUT TO TRY TO LOGIN")
    this.apiAuthService.apiLoginBasicAuth(encodedCreds)
      .subscribe(
        success => {
          console.log("RESPONSE IS: ", success);
          that.authService.setAuthCookies(
            success.eat,
            success.username,
            success.userId,
            success.email,
            success.role);
          that.close.emit(null);
        },
        err => {
          that.displayedValidationErrors['main'] += that.validationErrorMessages.login.user;
        }
      );
  }

  cancel(): boolean {
    console.log("CLOSE CLICKED!");
    console.log("USER CREDS IS: ", this.userCreds);
    console.log("CHECK REGEX: ", this.emailRegex.test(this.userCreds.email));
    this.close.emit(null);
    return false;
  }


  // ********** CUSTOM VALIDATIONS HERE - MAYBE BREAK INTO LIBRARY CLASS *************
  // the form would have to be a passed variable
  // errors array of messages would have to be passed in
  // displayed validtion errors could be pulled as the primary hasOwnProps keys of validationErrorMessages
  //
  displayedValidationErrors = {
    email: '',    // No message, when valid
    password: '', // No message, when valid
    main: ''      // User not found
  };

  private validationErrorMessages = {
    email: {
      pattern: 'Improper email. Please try again.',
      minlength: 'Email must be at least 6 characters.',
      taken: 'This email is already taken.',
    },
    password: {
      minlength: "Password must be at least 6 characters."
    },
    login: {
      user: "Invalid email/password combination. Please try again."
    }
  }

  ngAfterViewChecked() {
    this.formChanged();
  }

  private formChanged() {
    if(this.currentForm === this.loginForm) { return; }  // No changes? Stop here.

    this.loginForm = this.currentForm;  // Update the form with changes.

    if(this.loginForm) {
      this.loginForm.valueChanges.subscribe(data => this.onValueChanged(data));
    }
  }

  private onValueChanged(data?: any) {
    if(!this.loginForm) { return; }    // if no form object, exit.
    const form = this.loginForm.form;  // get the form

    for(const inputName in this.displayedValidationErrors) {
      // clear previous error messages
      console.log("INPUT NAME LOOKS LIKE: ", typeof inputName);
      this.displayedValidationErrors[inputName] = '';  // each error unser each inputName, clear it
      const control = form.get(inputName);             // get value from form input

      // If control inputName is dirtied & not valid & new user, show all applicable form errors
      if(control && control.dirty && !control.valid && this.userCreds.newAccount) {
        const msgs = this.validationErrorMessages[inputName];  // get all messages for inputName
        for(const error in control.errors) {
          console.log("TYPEOF CONTROL.ERRORS IS: ", typeof control.errors);
          this.displayedValidationErrors[inputName] += msgs[error] + ' ';
        }
      }
    }
  }
}
