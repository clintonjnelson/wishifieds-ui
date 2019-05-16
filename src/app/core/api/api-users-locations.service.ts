import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { WishifiedsApi } from '../api/wishifieds-api.service';
import { UserCreds, User, UserUpdates } from '../../users/user.model';
import { map, catchError } from 'rxjs/operators';


@Injectable()

export class ApiUsersLocationsService {
  constructor(private http:          Http,
              private wishifiedsApi: WishifiedsApi) {}


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
}
