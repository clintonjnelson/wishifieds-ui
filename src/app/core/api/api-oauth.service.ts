import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { WishifiedsApi } from '../api/wishifieds-api.service';
import { map, catchError } from 'rxjs/operators';

// This creates requests for Oauth2 (NOT Oauth1)

@Injectable()
export class ApiOauthService {
  constructor(private http:        Http,
              private wishifiedsApi: WishifiedsApi) {}

  oauthProviderRedirect(oauthProvider: string) {
    const eatToken = this.wishifiedsApi.getEatAuthCookie();
    const oauthUrl = this.wishifiedsApi.routes.oauth[oauthProvider];

    console.log("CALLING OAUTH2 AUTOSIGN...");
    window.location.href = oauthUrl +
                           '?eat=' + eatToken +
                           '&oauthProvider=' + oauthProvider;
  }

  getDataDeletionStatus(confirmationCode) {
    const dataDeletionUrl = this.wishifiedsApi.buildUrl('dataDeletionStatus',[{':confirmationCode': confirmationCode}]);
    return this.http
               .get(dataDeletionUrl)
               .pipe(
                 map(res => {
                   console.log("DATA DELETION CONFIRMATION IS: ", res);
                   return res.json();
                 }),
                 catchError(error => {
                   console.log("Error getting data deletion confirmation is: ", error);
                   return throwError(error);
                 })
               );
  }
}
