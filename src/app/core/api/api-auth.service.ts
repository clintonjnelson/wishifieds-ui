import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SignpostApi } from '../api/signpost-api.service';

@Injectable()

export class ApiAuthService {
  constructor(private http:        Http,
              private signpostApi: SignpostApi) {}

  apiLoginBasicAuth(encodedCreds: string): Observable<any> {
    const loginUrl   = this.signpostApi.routes.login;
    const authHeader = new Headers( { Authorization: 'Basic '+encodedCreds } );

    console.log("HAVE URL & HEADERS AND NOW ABOUT TO SEND")
    return this.http
               .get(loginUrl, {headers: authHeader})
               .map( res => {
                 console.log("GOT AN API RESPONSE: ", res);
                 return res.json();
               });
  }
}
