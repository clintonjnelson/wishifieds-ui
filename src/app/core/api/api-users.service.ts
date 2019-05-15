import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { WishifiedsApi } from '../api/wishifieds-api.service';
import { UserCreds, User, UserUpdates } from '../../users/user.model';
import { map, catchError } from 'rxjs/operators';

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
               .pipe(
                 map( user =>  {
                   console.log("RESPONSE FROM USER CREATION IS: ", user.json());
                   return user.json();
                 }),
                 catchError( (error: Response) => {
                   return throwError(error);
                   // show error message to user
                   // Maybe use remote logging infrastructure
                 })
               );
  }

  confirmUser(token: string, email: string): Observable<any> {
    const confirmUserUrl = this.wishifiedsApi.buildUrl('confirmUser', [{':confirmationtoken': token}, {':email': email}]);
    return this.http
               .get(confirmUserUrl)
               .pipe(
                 map( success => {
                   console.log("SUCCESS FROM CONFIRM USER IS: ", success);
                   return success.json();
                 }),
                 catchError( (error: Response) => {
                   return throwError(error);
                 })
               );
  }

  resendUserConfirmation(userId: string): Observable<any> {
    const confirmationResendUrl = this.wishifiedsApi.buildUrl('resendUserConfirmation', [ {':userId': userId} ]);
    const options = this.wishifiedsApi.getRequestOptionWithEatHeader();
    return this.http
               .get(confirmationResendUrl, options)
               .pipe(
                 map( success => {
                   console.log("SUCCESS FROM RESEND CONFIRMATION IS: ", success);
                   return success.json();
                 }),
                 catchError( (error: Response) => {
                   return throwError(error);
                 })
               );
  }

  getUserById(usernameOrId: string): Observable<any> {
    const getUserUrl = this.wishifiedsApi.buildUrl('getUserById', [ {':usernameOrId': usernameOrId} ] );
    const options    = this.wishifiedsApi.getRequestOptionWithEatHeader();

    console.log("HEADERS IS: ", options);
    return this.http
               .get(getUserUrl, options)
               .pipe(
                 map( user => {
                   console.log("RESPONSE FROM GET USER BY ID IS: ", user.json());
                   return user.json() as UserByIdResponse;
                 }),
                 catchError( (error: Response) => {
                   return throwError(error);
                 })
               );
  }

  getUsernameByUserId(userId: string): Observable<any> {
    const getUsernameUrl = this.wishifiedsApi.buildUrl('getUsernameByUserId', [ {':id': userId} ] );
    return this.http
               .get(getUsernameUrl)
               .pipe(
                 map( username => {
                   console.log("RESPONSE FROM GET USERNAME IS: ", username.json());
                   return username.json();
                 }),
                 catchError( (error: Response) => {
                   return throwError(error);
                 })
               );
  }

  getProfilePicByUserId(userId: string): Observable<any> {
    const getProfilePicUrl = this.wishifiedsApi.buildUrl('getProfilePicByUserId', [ {':id': userId} ]);
    const options = this.wishifiedsApi.getRequestOptionWithEatHeader();
    return this.http
               .get(getProfilePicUrl, options)
               .pipe(
                 map( response => {
                   console.log("RESPONSE FROM GET PROFILE_PIC_URL IS: ", response.json());
                   return response.json();
                 }),
                 catchError( (error: Response) => {
                   return throwError(error);
                 })
               );
  }

  // This is ONLY used by the requestor, so get from User Context
  getLocationsByUserId(userId: string): Observable<any> {
    const getLocationsByUserIdUrl = this.wishifiedsApi.buildUrl('getLocationsByUserId', [ {':id': userId} ] );
    return this.http
               .get(getLocationsByUserIdUrl)
               .pipe(
                 map( res => {
                   console.log("RESPONSE FROM GET USER LOCATIONS: ", res);
                   return res.json();
                 }),
                 catchError( (error: Response) => {
                   return throwError(error);
                 })
               );
  }

  // This is ONLY used by the requestor, so get from User Context
  // locationInfo is like: {postal: '12345', description: 'my fav location'}
  createUserLocation(userId: string, locationInfo: any): Observable<any> {
    const createUserLocationUrl = this.wishifiedsApi.buildUrl('createUserLocation', [{':id': userId}] );
    const options = this.wishifiedsApi.getRequestOptionWithEatHeader();
    return this.http
               .post(createUserLocationUrl, JSON.stringify(locationInfo), options)
               .pipe(
                 map( res => {
                   console.log("RESPONSE FROM CREATE USER LOCATIONS: ", res);
                   return res.json();
                 }),
                 catchError( (error: Response) => {
                   return throwError(error);
                 })
               );
  }

  setDefaultUserLocation(userId: string, userLocationId): Observable<any> {
    const setDefaultUserLocationUrl = this.wishifiedsApi.buildUrl('setDefaultUserLocation', [{':id': userId}] );
    const options = this.wishifiedsApi.getRequestOptionWithEatHeader();
    return this.http
               .patch(setDefaultUserLocationUrl, JSON.stringify({userLocationId: userLocationId}), options)
               .pipe(
                 map( res => {
                   console.log("RESPONSE FROM Set default USER LOCATIONS: ", res);
                   return res.json();
                 }),
                 catchError( (error: Response) => {
                   return throwError(error);
                 })
               );
  }

  deleteUserLocation(userId: string, userLocationId): Observable<any> {
    const deleteUserLocationUrl = this.wishifiedsApi.buildUrl(
      'deleteUserLocation', [{':id': userId}, {':userLocationId': userLocationId}]
    );
    const options = this.wishifiedsApi.getRequestOptionWithEatHeader();
    return this.http
               .delete(deleteUserLocationUrl, options)
               .pipe(
                 map( res => {
                   console.log("RESPONSE FROM Delete USER LOCATIONS: ", res);
                   return res.json();
                 }),
                 catchError( (error: Response) => {
                   return throwError(error);
                 })
               );
  }

  // updateProfilePic(userId: string, imageFile: FormData): Observable<boolean> {
  //   const updateProfilePicUrl = this.wishifiedsApi.buildUrl('updateProfilePic', [{':id': userId}]);
  //   const headers = this.wishifiedsApi.getHeaderWithEat();
  //   headers.append('Content-Type', 'multipart/form-data');
  //   return this.http
  //              .post(updateProfilePicUrl, imageFile, {headers: headers})
  //              .pipe(
  //                map( response => {
  //                  console.log("RESPONSE FROM PUT PROFILE_PIC_URL IS: ", response.json());
  //                  return response.json();
  //                }),
  //                catchError( (error: Response) => {
  //                  return throwError(error);
  //                })
  //              );
  // }

  // UPDATE THIS TO RETURN THE NEW USER????
  updateUser(userUpdates: UserUpdates): Observable<any> {
    const userUpdateUrl = this.wishifiedsApi.buildUrl('updateUser', [{':id': userUpdates.userId}]);
    const options = this.wishifiedsApi.getRequestOptionWithEatHeader();
    console.log("Updates to make: ", userUpdates);
    console.log("USER UPDATE URL IS: ", userUpdateUrl);
    return this.http
               .patch(userUpdateUrl, JSON.stringify({userUpdates: userUpdates}), options)
               .pipe(
                 map( success => {
                   console.log("RESPONSE FROM UPDATE USER IN OBSERVABLE");
                   return success.json();
                 }),
                 catchError( (error: Response) => {
                   return throwError(error);
                 })
               );
  }

  checkAvailableValues(username: string = '', email: string = '') {
    const getAvailabilityUrl = this.wishifiedsApi.buildUrl('checkAvailability', [{':username': username}, {':email': email}]);
    const options = this.wishifiedsApi.getRequestOptionWithEatHeader();

    console.log("URL FOR CHECKING AVAILABILITY IS: ", getAvailabilityUrl);
    return this.http
               .get(getAvailabilityUrl, options)
               .pipe(
                 map( availability => {
                   console.log("RESPONSE FROM GET AVAILABILITY IS: ", availability);
                   return availability.json();
                 }),
                 catchError( (error: Response) => {
                   return throwError(error);
                 })
               );
  }
}
