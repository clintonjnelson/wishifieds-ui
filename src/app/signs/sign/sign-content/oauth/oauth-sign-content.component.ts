import { Component } from '@angular/core';
import { SignContentComponent }  from '../sign-content.component';
import { HelpersService }        from '../../../../shared/helpers/helpers.service';
import { IconService }           from '../../../../core/services/icon.service';
import { AuthService, UserAuth } from '../../../../core/auth/auth.service';
import { ApiSignsService }       from '../../../../core/api/api-signs.service';
import { ModalService }          from '../../../../core/services/modal.service';

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

  constructor(private iconsInChild:           IconService,
              private helpersInChild:         HelpersService,
              private authServiceInChild:     AuthService,
              private apiSignsServiceInChild: ApiSignsService,
              private modalServiceInChild:    ModalService) {
    super(iconsInChild, helpersInChild, authServiceInChild, apiSignsServiceInChild, modalServiceInChild);
  }

  oauthRedirect() {
    console.log("TRYING THE REFRESH CALL...");
    this.apiSignsServiceInChild.oauthAutosignRedirect(this.sign.icon);
    console.log("JUST CALLED THE API.");
  }
}
