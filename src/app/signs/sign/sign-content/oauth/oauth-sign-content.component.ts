import { Component } from '@angular/core';
import { SignContentComponent } from '../sign-content.component';

@Component({
  moduleId: module.id,
  selector: 'oauth-sign-content',
  templateUrl: 'oauth-sign-content.component.html',
  styleUrls:  ['oauth-sign-content.component.css', '../sign-content.component.css']
})

export class OauthSignContentComponent extends SignContentComponent {
  // See SignContentComponent for data
  validationErrorMessages = {
    description: {}
  };
}
