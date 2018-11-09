import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { WishifiedsApi } from '../api/wishifieds-api.service';
import { UserCreds, User, UserUpdates } from '../../users/user.model';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// TODO: CREATE OBJECTS FOR THE RESPONSES ONCE THEYRE DIALED IN
class CreateUserResponse {
  eat: string;
  username: string;
  role: string;
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
              private wishifiedsApi: WishifiedsApi) {}

  // Create a new User Account
  createUser(creds: UserCreds): Observable<any> {
    const createUserUrl = this.wishifiedsApi.routes.createUser;
    console.log("DATA TO SEND IS: ", JSON.stringify(creds));
    return this.http
               .post(createUserUrl, JSON.stringify(creds))
               .map( user =>  {
                 console.log("RESPONSE FROM USER CREATION IS: ", user.json());
                 return user.json();
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
                 // show error message to user
                 // Maybe use remote logging infrastructure
               });
  }

  confirmUser(token: string, email: string): Observable<any> {
    const confirmUserUrl = this.wishifiedsApi.buildUrl('confirmUser', [{':confirmationtoken': token}, {':email': email}]);
    return this.http
               .get(confirmUserUrl)
               .map( success => {
                 console.log("SUCCESS FROM CONFIRM USER IS: ", success);
                 return success.json();
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }

  resendUserConfirmation(userId: string): Observable<any> {
    const confirmationResendUrl = this.wishifiedsApi.buildUrl('resendUserConfirmation', [ {':userId': userId} ]);
    const options = this.wishifiedsApi.getRequestOptionWithEatHeader();
    return this.http
               .get(confirmationResendUrl, options)
               .map( success => {
                 console.log("SUCCESS FROM RESEND CONFIRMATION IS: ", success);
                 return success.json();
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }

  getUserById(usernameOrId: string): Observable<any> {
    const getUserUrl = this.wishifiedsApi.buildUrl('getUserById', [ {':usernameOrId': usernameOrId} ] );
    const options    = this.wishifiedsApi.getRequestOptionWithEatHeader();

    console.log("HEADERS IS: ", options);
    return this.http
               .get(getUserUrl, options)
               .map( user => {
                 console.log("RESPONSE FROM GET USER BY ID IS: ", user.json());
                 return user.json() as UserByIdResponse;
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }

  getUsernameByUserId(userId: string): Observable<any> {
    const getUsernameUrl = this.wishifiedsApi.buildUrl('getUsernameByUserId', [ {':id': userId} ] );
    return this.http
               .get(getUsernameUrl)
               .map( username => {
                 console.log("RESPONSE FROM GET USERNAME IS: ", username.json());
                 return username.json();
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }

  getProfilePicByUserId(userId: string): Observable<any> {
    const getProfilePicUrl = this.wishifiedsApi.buildUrl('getProfilePicByUserId', [ {':id': userId} ]);
    return this.http
                 .get(getProfilePicUrl)
                 .map( response => {
                   console.log("RESPONSE FROM GET PROFILE_PIC_URL IS: ", response.json());
                   return response.json();
                 })
                 .catch( (error: Response) => {
                   return Observable.throw(error);
                 });
  }

  // UPDATE THIS TO RETURN THE NEW USER????
  updateUser(userUpdates: UserUpdates): Observable<any> {
    const userUpdateUrl = this.wishifiedsApi.buildUrl('updateUser', [{':id': userUpdates.userId}]);
    const options = this.wishifiedsApi.getRequestOptionWithEatHeader();
    console.log("Updates to make: ", userUpdates);
    console.log("USER UPDATE URL IS: ", userUpdateUrl);
    return this.http
               .patch(userUpdateUrl, JSON.stringify({userUpdates: userUpdates}), options)
               .map( success => {
                 console.log("RESPONSE FROM UPDATE USER IN OBSERVABLE");
                 return success.json();
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }

  checkAvailableValues(username: string = '', email: string = '') {
    const getAvailabilityUrl = this.wishifiedsApi.buildUrl('checkAvailability', [{':username': username}, {':email': email}]);
    const options = this.wishifiedsApi.getRequestOptionWithEatHeader();

    console.log("URL FOR CHECKING AVAILABILITY IS: ", getAvailabilityUrl);
    return this.http
               .get(getAvailabilityUrl, options)
               .map( availability => {
                 console.log("RESPONSE FROM GET AVAILABILITY IS: ", availability);
                 return availability.json();
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }
}
