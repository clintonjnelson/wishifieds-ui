import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HelpersService } from '../shared/helpers/helpers.service';
import { AuthService } from '../core/auth/auth.service';

@Component({
  moduleId: module.id,
  selector: 'password-reset',
  templateUrl: 'password-reset.component.html',
  styleUrls:  ['password-reset.component.css']
})

export class PasswordResetComponent {
  testing = true;  // DELETE THIS VAR ONCE API IS HOOLED UP!!!!!!

  password: string;
  displayedValidationErrors = {password: ''};
  constructor(
               private helpers: HelpersService,
               private router:  Router,
               private authService: AuthService
             ) {
    this.displayedValidationErrors.password = '';
  }


  onSubmit() {
    // Send the token and new password to the server
    // SUCCESS: Should get the user eat cookie & reroute to the user page
    if(!this.testing) {
      var res = {eatCookie: "somecookie", username: "someone", userid: '123', email: 'r@em.co', role: ''};
      this.authService.setAuthCookies(res.eatCookie, res.username, res.userid, res.email, res.role);
      this.router.navigate([res.username]);
    }
    // ERROR: Could not save, waited too long (token expire)... other?
    else {
      this.testing = false;
      // Can set the error message to a pre-defined message or custom from the API
      this.displayedValidationErrors.password = 'Error saving the password. Please try again';
    }
  }
}
