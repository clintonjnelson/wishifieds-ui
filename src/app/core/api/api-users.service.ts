import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SignpostApi } from '../api/signpost-api.service';
import { UserCreds, User } from '../../users/user.model';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()

export class ApiUsersService {
  constructor(private http:        Http,
              private signpostApi: SignpostApi) {}

  // Create a new User Account
  createUser(creds: UserCreds): Observable<any> {
    let createUserUrl = this.signpostApi.routes.createUser;
    let headers       = this.signpostApi.headers.contentType.appJson;
    let options       = new RequestOptions({headers: headers});

    console.log("DATA TO SEND IS: ", JSON.stringify(creds));
    return this.http
               .post(createUserUrl, JSON.stringify(creds), options)
               .map( (res) =>  {
                 console.log("RESPONSE IS: ", res.json());
                 return res.json();
               })
               .catch( (error: Response | any) => {
                 console.log("ERROR IS: ", error);
                 return error;
                 // show error message to user
                 // Maybe use remote logging infrastructure
               });
  }
}
