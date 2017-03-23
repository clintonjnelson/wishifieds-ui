import { Component, Input } from '@angular/core';
import { HelpersService } from '../../../shared/helpers/helpers.service';
import { HoverColorDirective } from '../../../shared/hover-color/hover-color.directive';
import { SignpostApi } from '../../../core/api/signpost-api.service';


@Component({
  moduleId: module.id,
  selector: 'oauth-link',
  templateUrl: 'oauth-link.component.html',
  styleUrls:  ['oauth-link.component.css']
})

export class OauthLinkComponent {
  @Input() url:      string;
  @Input() icon:     string;
  @Input() bgColor:  string;
  @Input() iconSize: string;

  constructor(private helpers:     HelpersService,
              private signpostApi: SignpostApi) {}

  submit() {
    //let eatToken = this.signpostApi.getEatAuthCookie();
    let eatToken = this.signpostApi.getEatAuthCookie();
    // console.log("EAT TOKEN PRIOR TO SENDING IS: ", eatToken);
    // document.cookie = 'eat=' + eatToken;
    if(this.icon === 'twitter') {
      document.cookie = 'oauth1eat=' + eatToken;
      window.location.href = this.url + '?eat=' + eatToken;
    }
    else {
      window.location.href = this.url + '?eat=' + eatToken;
    }

  }
}
