import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HelpersService } from '../shared/helpers/helpers.service';
import { AuthService } from '../core/auth/auth.service';
import { ApiAuthService } from '../core/api/api-auth.service';

@Component({
  moduleId: module.id,
  selector: 'password-reset',
  templateUrl: 'password-reset.component.html',
  styleUrls:  ['password-reset.component.css']
})

export class PasswordResetComponent {
  password: string;
  displayedValidationErrors = {password: ''};
  constructor(
               private helpers:        HelpersService,
               private route:          ActivatedRoute,
               private router:         Router,
               private authService:    AuthService,
               private apiAuthService: ApiAuthService,
             ) {
    this.displayedValidationErrors.password = '';
  }


  onSubmit() {
    let email      = this.route.snapshot.queryParams['email'];
    let resetToken = this.route.snapshot.queryParams['resettoken'];
    console.log("RESET TOKEN FOUND IS: ", resetToken);

    this.apiAuthService.passwordReset(email, this.password, resetToken)
        .subscribe(
          success => {
            console.log("SUCCESS ON RESET IS: ", success);
            let user = success.user;
            this.authService.setAuthCookies(user.eat, user.username, user.userId, user.email, user.role);
            this.router.navigate([user.username]);
          },
          error => {
            console.log("ERROR ON RESET IS: ", error);
            switch(error.msg) {
              case 'invalid-expired': break;
              case 'invalid-email':   break;
              default: this.displayedValidationErrors.password = 'Error saving the password. Please try again';
            }
          });
  }
}
