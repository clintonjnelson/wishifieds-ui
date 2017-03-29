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
        let expDate = new Date();
        expDate.setTime(expDate.getTime() + 8000);
        // console.log("COOKIE EAT TOKEN IS: ", eatToken);
        // console.log("COOKIE EXP DATE IS: ", expDate.toUTCString());
        document.cookie = 'oauth1eat=' + eatToken + '; expires=' + expDate.toUTCString() +'; path=/';
        // console.log("READING COOKIE TO CHECK IF EXPIRED: ", readCookie('oauth1eat'));
        // console.log("UPDATED COOKIES OBJECT IS: ", document.cookie);
        // I don't think Oauth1 needs the query. Won't use it.
        window.location.href = this.url + '?signType=' + this.icon;
        break;
      }
      default: {
        window.location.href = this.url +
                                '?eat='      + eatToken +
                                '&signType=' + this.icon;
      }
    }

    // function readCookie(name) {
    //   var nameEQ = name + "=";
    //   var ca = document.cookie.split(';');
    //   for(var i=0;i < ca.length;i++) {
    //     var c = ca[i];
    //     while (c.charAt(0)==' ') c = c.substring(1,c.length);
    //     if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    //   }
    //   return null;
    // }
  }
}
