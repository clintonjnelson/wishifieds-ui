import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SignpostApi } from './signpost-api.service';


@Injectable()

export class ApiInteractionLoggerService {
  guid: string;

  constructor( private http:         Http,
               private signpostApi:  SignpostApi) {
    this.guid = window.localStorage.getItem('guid'); // null if not found
  }

  logUserPageVisit(pageUsername: string, interactUserId: string = null) {
    if(!this.guid || !pageUsername) {
      console.log("MISSING VALUES FOR USERPAGEVISIT INTERACTION LOGGINS. pageUsername: ", pageUsername, "; GUID: ", this.guid);
      return;
    }
    const url = this.signpostApi.buildUrl('userPageVisit', [{':guid': this.guid}, {':pageusername': pageUsername}, { ':userid': interactUserId }]);
    console.log("URL TO SEND TO IS: ", url);
    this.http.get(url).subscribe();
  }

  logSignLinkOffClick(signId: string, interactUserId: string = null) {
    if(!this.guid || !signId) {
      console.log("MISSING VALUES FOR SIGNLINKOFFCLICK INTERACTION LOGGING. signId: ", signId, "; GUID: ", this.guid);
      return;
    }
    const url = this.signpostApi.buildUrl('signLinkOff', [{':guid': this.guid}, {':signid': signId }, {':userid': interactUserId}]);
    console.log("URL TO SEND TO IS: ", url);
    this.http.get(url).subscribe();
  }
}


