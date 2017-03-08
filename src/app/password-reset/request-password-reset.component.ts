import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HelpersService } from '../shared/helpers/helpers.service';


@Component({
  moduleId: module.id,
  selector: 'request-password-reset',
  templateUrl: 'request-password-reset.component.html',
  styleUrls:  ['request-password-reset.component.css'],
})

export class RequestPasswordResetComponent {
  testing = true;  // DELETE THIS VAR ONCE API IS HOOKED UP!!!!!!

  email: string;
  displayedValidationErrors = {email: ''};
  constructor(private helpers: HelpersService, private router:  Router) {
    this.displayedValidationErrors.email = '';
  }


  onSubmit() {
    // TRY TO SEND EMAIL TO THE API SERVER
    // SUCCESS, reroute the user to the email change page
    if(!this.testing) {
      this.router.navigate(['requestpasswordchange', 'change']);
    }
    // ERROR, Email not found
    else {
      this.testing = false;    // REMOVE THIS, JUST FOR TESTING TILL API IS UP
      // Can set the error message to a pre-defined message or custom from the API
      this.displayedValidationErrors.email = 'Email not found. Please try again.';
    }
  }
}
