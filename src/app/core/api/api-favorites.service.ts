import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { WishifiedsApi } from '../api/wishifieds-api.service';
import { map, catchError } from 'rxjs/operators';


@Injectable()
export class ApiFavoritesService {
  constructor(private http:          Http,
              private wishifiedsApi: WishifiedsApi) {}

  // Gets the state of the favorites requested (returns an object of {listingId: boolean})
  getFavoritesForUser(listingIds: any[]): Observable<any> {
    const listingIdsArr = Array.from(listingIds)
    const getFavoritesForUser = this.wishifiedsApi.buildUrl('getFavoritesForUser', [{':listingIds': listingIds.join(',')}]);
    const options = this.wishifiedsApi.getRequestOptionWithEatHeader();

    return this.http
               .get(getFavoritesForUser, options)
               .pipe(
                 map( res => {
                   return res.json();
                 }),
                 catchError( (error: Response) => {
                   return throwError(error);
                 })
               );
  }

  addFavorite(listingId: any): Observable<any> {
    const addFavoriteUrl = this.wishifiedsApi.buildUrl('addFavorite', [{':listingId': listingId}]);
    const options = this.wishifiedsApi.getRequestOptionWithEatHeader();
    return this.http
               .post(addFavoriteUrl, null, options)
               .pipe(
                 map(res => {
                   return res.json();
                 }),
                 catchError( (error: Response) => {
                   return throwError(error);
                 })
               );
  }

  // Implies singular, but actually takes an array of listingIds
  removeFavorite(listingId: any): Observable<any> {
    const removeFavoriteUrl = this.wishifiedsApi.buildUrl('removeFavorite', [{':listingId': listingId}]);
    const options = this.wishifiedsApi.getRequestOptionWithEatHeader();
    return this.http
               .delete(removeFavoriteUrl, options)
               .pipe(
                 map(res => {
                   return res.json();
                 }),
                 catchError( (error: Response) => {
                   return throwError(error);
                 })
               );
  }


  // Gets the favorites for the requesting user, so no explicit ID needed at this time
  // getFavoriteListingsByUser(): Observable<Listing[]> {
  //   const getFavListingsByUserUrl = this.wishifiedsApi.routes.getFavoriteListingsByUser;
  //   const options = this.wishifiedsApi.getRequestOptionWithEatHeader();

  //   return this.http
  //              .get(getFavListingsByUserUrl, options)
  //              .pipe(
  //                map(res => {
  //                  return res.json().listings as Listing[];
  //                }),
  //                catchError( (error: Response) => {
  //                  return Observable.throw(error);
  //                })
  //              );
  // }

  // createListing(listingData: any): Observable<Listing> {
  //   const createListingUrl = this.wishifiedsApi.routes.createListing;
  //   const options = this.wishifiedsApi.getRequestOptionWithEatHeader();

  //   return this.http
  //              .post(createListingUrl, JSON.stringify({listingData: listingData}), options)
  //              .pipe(
  //                map( res => {
  //                  console.log("SUCCESS Create Listing: ", res);
  //                  return res.json().listing as Listing;
  //                }),
  //                catchError( (error: Response) => {
  //                  return Observable.throw(error);
  //                })
  //              );
  // }

  // updateListing(listingData: any): Observable<Listing> {
  //   const updateListingUrl = this.wishifiedsApi.buildUrl('updateListing', [{':id': listingData.id}]);
  //   const options = this.wishifiedsApi.getRequestOptionWithEatHeader();

  //   return this.http
  //              .put(updateListingUrl, JSON.stringify({listingData: listingData}), options)
  //              .pipe(
  //                map( res => {
  //                  console.log("SUCCESS Update Listing: ", res);
  //                  return res.json().listing as Listing;
  //                }),
  //                catchError( (error: Response) => {
  //                  return Observable.throw(error);
  //                })
  //              );
  // }
}
