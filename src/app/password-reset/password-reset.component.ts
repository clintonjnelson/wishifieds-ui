import { Component }      from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IconService }    from '../core/services/icon.service';
import { AuthService }    from '../core/auth/auth.service';
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
               private icons:          IconService,
               private route:          ActivatedRoute,
               private router:         Router,
               private authService:    AuthService,
               private apiAuthService: ApiAuthService,
             ) {
    this.displayedValidationErrors.password = '';
  }


  onSubmit() {
    const email      = this.route.snapshot.queryParams['email'];
    const resetToken = this.route.snapshot.queryParams['resettoken'];
    console.log("RESET TOKEN FOUND IS: ", resetToken);

    this.apiAuthService.passwordReset(email, this.password, resetToken)
        .subscribe(
          success => {
            console.log("SUCCESS ON RESET IS: ", success);
            const user = success.user;
            this.authService.setAuthCookies(user.eat, user.username, user.userId, user.email, user.role, user.profilePicUrl);
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

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }
 }
