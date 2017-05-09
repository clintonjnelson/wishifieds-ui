import { Component, Input }    from '@angular/core';
import { IconService }         from '../../../core/services/icon.service';
import { HoverColorDirective } from '../../../shared/hover-color/hover-color.directive';
import { SignpostApi }         from '../../../core/api/signpost-api.service';
import { ApiSignsService }     from '../../../core/api/api-signs.service';
// import { OauthRequestService } from '../../../core/redirects/oauth-request.service';


@Component({
  moduleId:    module.id,
  selector:    'oauth-link',
  templateUrl: 'oauth-link.component.html',
  styleUrls:  ['oauth-link.component.css']
})

export class OauthLinkComponent {
  @Input() url:      string;   // NO LONGER USED, but may be useful? Else discard.
  @Input() icon:     string;
  @Input() bgColor:  string;
  @Input() iconSize: string;

  constructor(private icons:           IconService,
              private signpostApi:     SignpostApi,
              private apiSignsService: ApiSignsService) {}

  submit() {
    this.apiSignsService.oauthAutosignRedirect(this.icon);
  }

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }
}
