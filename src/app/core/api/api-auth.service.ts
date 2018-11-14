import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { WishifiedsApi } from '../api/wishifieds-api.service';
import { map, catchError } from 'rxjs/operators';

@Injectable()

export class ApiAuthService {
  constructor(private http:        Http,
              private wishifiedsApi: WishifiedsApi) {}

  // Basic auth login
  apiLoginBasicAuth(encodedCreds: string): Observable<any> {
    const loginUrl   = this.wishifiedsApi.routes.login;
    const authHeader = new Headers( { Authorization: 'Basic '+encodedCreds } );

    console.log("HAVE URL & HEADERS AND NOW ABOUT TO SEND");
    return this.http
               .get(loginUrl, {headers: authHeader})
               .pipe(
                 map( res => {
                   console.log("GOT AN API RESPONSE: ", res);
                   return res.json();
                 }),
                 catchError( (error: Response) => {
                   return Observable.throw(error);
                 })
               );
  }

  // Send password reset email
  passwordResetEmail(email: string): Observable<any> {
    const resetRequestUrl = this.wishifiedsApi.buildUrl('passwordResetEmail', [{':email': email}]);

    return this.http
               .get(resetRequestUrl)
               .pipe(
                 map( res => {
                   console.log("GOT AN API RESPONSE: ", res);
                   return res.json();
                 }),
                 catchError( (error: Response) => {
                   return Observable.throw(error);
                 })
               );
  }

  // Change password w/ credentials
  passwordReset(email: string, password: string, resetToken: string): Observable<any> {
    const resetUrl = this.wishifiedsApi.routes.passwordReset;

    return this.http
               .put(resetUrl, JSON.stringify({email: email, password: password, resetToken: resetToken}))
               .pipe(
                 map( res => {
                   console.log("GOT AN API RESPONSE: ", res);
                   return res.json();
                 }),
                 catchError( (error: Response) => {
                   return Observable.throw(error);
                 })
               );
  }
}
