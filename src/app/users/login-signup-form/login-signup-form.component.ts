import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { UserCreds } from '../../users/user.model';


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

  constructor( private authService: AuthService) {
    this.userCreds = {
      email:      '',
      password:   '',
      newAccount: false,
      termsCond:  null
    };
  };

  login(): boolean {
    console.log("LOGIN CLICKED");
    console.log("LOGIN FORM IS: ", this.loginForm);
    console.log("USER CREDS IS: ", this.userCreds);
    if(this.loginForm.form.valid) {
      this.authService.login();
      // VALIDATE SUCCESS BEFORE CLOSING WHEN HTTP HOOKED UP
      this.close.emit(null);
      return false;
    }
    else {

    }
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
    email: '',  // No message, when valid
    password: ''      // No message, when valid
  };

  private validationErrorMessages = {
    email: {
      pattern: 'Improper email. Please try again.',
      minlength: 'Email must be at least 6 characters',
    },
    password: {
      minlength: "Password must be at least 6 characters"
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
      this.displayedValidationErrors[inputName] = '';  // each error unser each inputName, clear it
      const control = form.get(inputName);             // get value from form input

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







///////////////////MAYBE MOVE THIS UP TO THE NAVBAR PARENT LEVEL TO CONTROL???
///////////////////OR MAKE THE OAUTH LINKS THEIR OWN TYPE OF COMPOENT???
// 'use strict';
// /*
//   Routes Covered:
//     - /oauth
//     - /login

//   This module covers two cases:
//   Oauth signin where a cookie is sent to /oauth and parsed out of the params
//   Basic signin, where the user creates a login through the website
// */
// module.exports = function (app) {
//     app.controller('sessionsController', [
//         'sessions',
//         '$scope',
//         '$http',
//         '$routeParams',
//         '$window',
//         function (sessions, $scope, $http, $routeParams, $window) {
//             var currPath = sessions.currPath();
//             //-------------------- LOGOUT ------------------
//             if (checkPath('/logout')) {
//                 sessions.resetSession(); // clear token, redirect greet
//                 $window.location.reload();
//                 sessions.redirect('/greet');
//             }
//             console.log("SHOULD NOT HIT THIS ON LOGOUT");
//             //-------------------- OAUTH ------------------
//             if (checkPath('/oauth') && $routeParams.token) {
//                 console.log("ITS TRYING OAUTH", $routeParams.token);
//                 sessions.setOauthSession(); // session+token+user => load/clear/redirect
//             }
//             else if (checkPath('/oauth')) {
//                 sessions.redirect('/greet');
//             }
//             //--------------------- BASIC AUTH ---------------------
//             // $scope & initial values
//             $scope.user = {};
//             $scope.user.newAccount = false;
//             $scope.user.termsCond = false;
//             // Functions
//             $scope.login = function () {
//                 if ($scope.user.newAccount) {
//                     if ($scope.user.termsCond) {
//                         $http.post('/users', $scope.user)
//                             .success(function (data) {
//                             sessions.setBasicSession(data); // sets: eat, user, http-eat-header
//                             console.log('User created.');
//                         })
//                             .error(function (err) {
//                             console.log('Error creating user.');
//                         });
//                     }
//                     else {
//                     }
//                 }
//                 else {
//                     sessions.login($scope.user, function (err, data) {
//                         if (err) {
//                             return console.log("ERROR LOGGING IN: ", err);
//                         }
//                         console.log("LOGGED IN.");
//                         sessions.redirect('/'); // redirects if not successful
//                     });
//                 }
//             };
//             function checkPath(path) {
//                 return (currPath === path ? true : false);
//             }
//         }
//     ]);
// };
