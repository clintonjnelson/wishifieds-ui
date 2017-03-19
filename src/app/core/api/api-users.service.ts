import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SignpostApi } from '../api/signpost-api.service';
import { UserCreds, User } from '../../users/user.model';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// TODO: CREATE OBJECTS FOR THE RESPONSES ONCE THEYRE DIALED IN
class CreateUserResponse {
  eat: string;
  username: string;
  role: string
}

class UserByIdResponse {
  username:  string;
  email:     string;
  role:      string;
  confirmed: boolean;
};


@Injectable()

export class ApiUsersService {
  constructor(private http:        Http,
              private signpostApi: SignpostApi) {}

  // Create a new User Account
  createUser(creds: UserCreds): Observable<any> {
    let createUserUrl = this.signpostApi.routes.createUser;

    console.log("DATA TO SEND IS: ", JSON.stringify(creds));
    return this.http
               .post(createUserUrl, JSON.stringify(creds))
               .map( user =>  {
                 console.log("RESPONSE FROM USER CREATION IS: ", user.json());
                 return user.json();
               })
               .catch( (error: Response | any) => {
                 console.log("ERROR FROM USER CREATION IS: ", error);
                 return error;
                 // show error message to user
                 // Maybe use remote logging infrastructure
               });
  }

  getUserById(usernameOrId: string): Observable<any> {
    let getUserUrl = this.signpostApi.buildUrl('getUserById', [ {':usernameOrId': usernameOrId} ] );
    const options  = this.signpostApi.getRequestOptionWithEatHeader();

    console.log("HEADERS IS: ", options);
    return this.http
               .get(getUserUrl, options)
               .map( user => {
                 console.log("RESPONSE FROM GET USER BY ID IS: ", user.json());
                 return user.json() as UserByIdResponse;
               })
               .catch( (error: Response | any) => {
                 console.log("ERROR FROM GET USER BY ID IS: ", error);
                 return error;
                 // show error message to user
                 // Maybe use remote logging infrastructure
               });
  }
}
