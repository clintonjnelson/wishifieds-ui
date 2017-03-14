import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SignpostApi } from './signpost-api.service';
import { AuthService } from '../auth/auth.service';
import { Sign } from '../../signs/sign.model';

@Injectable()

export class ApiSignsService {
  constructor(private http:        Http,
              private auth:        AuthService,
              private signpostApi: SignpostApi) {}

  getSignsByUsernameOrId(usernameOrId: string): Observable<Sign[]> {
    let getSignsUrl = this.signpostApi.buildUrl('getSignsByUsernameOrId', [{':usernameOrId': usernameOrId}]);
    return this.http
               .get(getSignsUrl)
               .map( res => {
                 console.log("RESPONSE FROM GET SIGNS BY USER/ID IS: ", res);
                 // RETURN A CUSTOM TYPE HERE IF ALSO NEED THE USERNAME OR REMOVE USERNAME RESPONSE
                 return res.json().signs as Sign[];
               })
               .catch( (error: Response | any) => {
                 console.log("ERROR FROM GET SIGNS BY USER/ID IS: ", error);
                 return error;
                 // show error message to user
                 // Maybe use remote logging infrastructure
               });
  }

  createSign(proposedSign: Sign): Observable<Sign> {
    const createSignUrl = this.signpostApi.routes.createSign;
    let headers         = this.signpostApi.headers.contentType.appJson;
    if(headers.has('eat')) { headers.set(   'eat', this.auth.getEatAuthCookie()) }
    else                   { headers.append('eat', this.auth.getEatAuthCookie()); }

    const options       = new RequestOptions({headers: headers});

    return this.http
               .post(createSignUrl, JSON.stringify({sign: proposedSign}), options)
               .map( res => {
                 console.log("SUCCESS RESPONSE RETURNED FOR SIGN CREATION WITH: ", res);
                 return res.json().sign as Sign;  // hmmmm...
               })
               .catch( error => {
                 console.log("ERROR CREATING SIGN: ", error);
                 return error.json();
               });
  }
}

