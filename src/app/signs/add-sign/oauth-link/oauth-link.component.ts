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
    let eatToken = this.signpostApi.getEatAuthCookie();

    // Oauth1 requires current eat token in cookie
    // Oauth2 token requires eat token in query
    switch (this.icon) {
      case 'twitter': {
        document.cookie = 'oauth1eat=' + eatToken;
        // I don't think Oauth1 needs the query. Won't use it.
        window.location.href = this.url; // + '?eat=' + eatToken;
        break;
      }
      default: { window.location.href = this.url + '?eat=' + eatToken; }
    }
  }
}
