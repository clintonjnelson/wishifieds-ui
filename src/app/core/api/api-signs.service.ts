import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SignpostApi } from './signpost-api.service';
import { AuthService } from '../auth/auth.service';
import { Sign } from '../../signs/sign.model';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()

export class ApiSignsService {
  constructor(private http:        Http,
              private auth:        AuthService,
              private signpostApi: SignpostApi) {}

  getSignsByUsernameOrId(usernameOrId: string): Observable<Sign[]> {
    const getSignsUrl = this.signpostApi.buildUrl('getSignsByUsernameOrId', [{':usernameOrId': usernameOrId}]);
    return this.http
               .get(getSignsUrl)
               .map( res => {
                 console.log("RESPONSE FROM GET SIGNS BY USER/ID IS: ", res);
                 // RETURN A CUSTOM TYPE HERE IF ALSO NEED THE USERNAME OR REMOVE USERNAME RESPONSE
                 return res.json().signs as Sign[];
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
                 // show error message to user
                 // Maybe use remote logging infrastructure
               });
  }

  createSign(proposedSign: Sign): Observable<Sign> {
    const createSignUrl = this.signpostApi.routes.createSign;
    const options       = this.signpostApi.getRequestOptionWithEatHeader();

    return this.http
               .post(createSignUrl, JSON.stringify({sign: proposedSign}), options)
               .map( res => {
                 console.log("SUCCESS RESPONSE RETURNED FOR SIGN CREATION WITH: ", res);
                 return res.json().sign as Sign;  // hmmmm...
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }

  updateSign(proposedSign: Sign): Observable<Sign> {
    const updateSignUrl = this.signpostApi.routes.updateSign;
    const options       = this.signpostApi.getRequestOptionWithEatHeader();

    return this.http
               .patch(updateSignUrl, JSON.stringify({sign: proposedSign}), options)
               .map( res => {
                 console.log("SUCCESS RESPONSE RETURNED FOR SIGN UPDATE: ", res);
                 return res.json().sign as Sign;
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }

  oauthAutosignRedirect(oauthTypeIcon: string) {
    const eatToken = this.signpostApi.getEatAuthCookie();
    const oauthUrl = this.signpostApi.routes.oauthAutoSign[oauthTypeIcon];

    // Oauth1 requires current eat token in cookie
    // Oauth2 token requires eat token in query
    switch (oauthTypeIcon) {
      case 'twitter': { callOauth1(); break; }
      case 'tumblr':  { callOauth1(); break; }
      case 'etsy':    { callOauth1(); break; }
      default: {
        console.log("CALLING OAUTH2 AUTOSIGN...");
        window.location.href = oauthUrl +
                               '?eat='      + eatToken +
                               '&signType=' + oauthTypeIcon;
      }
    }

    function callOauth1() {
      console.log("CALLING OAUTH1 AUTOSIGN...");
      const expDate = new Date();
      expDate.setTime(expDate.getTime() + 8000);
      document.cookie = 'oauth1eat=' + eatToken + '; expires=' + expDate.toUTCString() +'; path=/';
      window.location.href = oauthUrl + '?signType=' + oauthTypeIcon;
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

  updateSignOrder(orderedSignIds: string[]): Observable<any> {
    const updateSignOrderUrl = this.signpostApi.routes.updateSignOrder;
    const options            = this.signpostApi.getRequestOptionWithEatHeader();

    console.log("ABOUT TO SEND THIS LIST: ", orderedSignIds);
    return this.http
               .patch(updateSignOrderUrl, JSON.stringify({order: orderedSignIds}), options)
               .map( res => {
                 console.log("SUCCESS ORDERING RESPONSE: ", res);
                 return res.json();  // DONT NEED, SUCCESS IS ENOUGH VERIFICATION
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }

  destroySign(sign: Sign, deleteOauth: boolean): Observable<boolean> {
    console.log("IN THE DESTROY_SIGN METHOD...");
    const destroySignUrl = this.signpostApi.routes.destroySign;
    const headers        = this.signpostApi.getHeaderWithEat();
    const options        = new RequestOptions({
                              headers: headers,
                              body:    JSON.stringify({sign: sign, deleteOauth: deleteOauth})
                           });

    return this.http
               .delete(destroySignUrl, options)
               .map( res => {
                 console.log("SUCCESSFUL DELETION OF SIGN. Response is: ", res);
                 return res.json() as boolean;
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }
}

