import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SignpostApi } from '../api/signpost-api.service';

@Injectable()

export class ApiAuthService {
  constructor(private http:        Http,
              private headers:     Headers,
              private signpostApi: SignpostApi) {}

  apiLoginBasicAuth(creds: string): Observable<any> {
    let loginUrl = this.signpostApi.routes.login;
    let authHeader = new Headers( { Authorization: 'Basic '+creds } );
    return this.http
               .get(loginUrl, {headers: authHeader})
               .map( (res) => {
                 let apiResponse = res.json();
                 console.log("GOT AN API RESPONSE: ", apiResponse);
                 return res.json();
               })
  }
}
