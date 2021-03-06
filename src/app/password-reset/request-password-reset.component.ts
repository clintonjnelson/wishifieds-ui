import { Component }      from '@angular/core';
import { IconService }    from '../core/services/icon.service';
import { ApiAuthService } from '../core/api/api-auth.service';


@Component({
  moduleId: module.id,
  selector: 'request-password-reset',
  templateUrl: 'request-password-reset.component.html',
  styleUrls:  ['request-password-reset.component.css'],
})

export class RequestPasswordResetComponent {
  isProcessing = false;
  email: string;
  displayedValidationErrors = {email: ''};

  constructor(private icons:          IconService,
              private apiAuthService: ApiAuthService) {
    this.displayedValidationErrors.email = '';
  }


  onSubmit() {
    const that = this;
    this.isProcessing = true;
    this.apiAuthService.passwordResetEmail(that.email)
      .subscribe(
        success => {
          console.log("SUCCESSFUL REQUEST, EMAIL SENT. SUCCESS IS: ", success);
          that.displayedValidationErrors.email = 'Email sent! Please check your inbox for link to reset password. :-)';
          // Never reset the isProcessing, as it was successful = done on this page!
        },
        error => {
          console.log("ERROR DURING EMAIL REQUEST. ERROR IS: ", error);
          that.displayedValidationErrors.email = 'Email could not be sent. Please check email & try again.';
          that.isProcessing = false;
        });
  }

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }
}
