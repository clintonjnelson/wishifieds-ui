import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SignpostApi } from '../api/signpost-api.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()

export class ApiAuthService {
  constructor(private http:        Http,
              private signpostApi: SignpostApi) {}

  // Basic auth login
  apiLoginBasicAuth(encodedCreds: string): Observable<any> {
    const loginUrl   = this.signpostApi.routes.login;
    const authHeader = new Headers( { Authorization: 'Basic '+encodedCreds } );

    console.log("HAVE URL & HEADERS AND NOW ABOUT TO SEND")
    return this.http
               .get(loginUrl, {headers: authHeader})
               .map( res => {
                 console.log("GOT AN API RESPONSE: ", res);
                 return res.json();
               })
               .catch( err => {
                 console.log("ERROR FROM THE API: ", err);
                 return err.json();
               });
  }

  // Send password reset email
  passwordResetEmail(email: string): Observable<any> {
    const resetRequestUrl = this.signpostApi.buildUrl('passwordResetEmail', [{':email': email}]);

    return this.http
               .get(resetRequestUrl)
               .map( res => {
                 console.log("GOT AN API RESPONSE: ", res);
                 return res.json();
               })
               .catch( err => {
                 console.log("ERROR FROM THE API: ", err);
                 return err.json();
               });
  }

  // Change password w/ credentials
  passwordReset(email: string, password: string, resetToken: string): Observable<any> {
    const resetUrl = this.signpostApi.routes.passwordReset;

    return this.http
               .put(resetUrl, JSON.stringify({email: email, password: password, resetToken: resetToken}))
               .map( res => {
                 console.log("GOT AN API RESPONSE: ", res);
                 return res.json();
               })
               .catch( err => {
                 console.log("ERROR FROM THE API: ", err);
                 return err.json();
               });
  }
}
