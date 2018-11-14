import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { WishifiedsApi } from '../api/wishifieds-api.service';
import { Listing } from '../../listings/listing.model';
import { map, catchError } from 'rxjs/operators';


@Injectable()
export class ApiListingsService {
  constructor(private http:          Http,
              private wishifiedsApi: WishifiedsApi) {}

  // This assumes user object on request will be used to get their listings
  getListing(listingId: any): Observable<Listing> {
    const getListingUrl = this.wishifiedsApi.buildUrl('getListing', [{':id': listingId}]);

    return this.http
               .get(getListingUrl)
               .pipe(
                 map(res => {
                   return res.json().listing as Listing;
                 }),
                 catchError( (error: Response) => {
                   return Observable.throw(error);
                 })
               );
  }

  getListingsByUser(usernameOrId: any): Observable<Listing[]> {
    const getListingsByUserUrl = this.wishifiedsApi.buildUrl('getListingsByUser', [{':usernameOrId': usernameOrId}]);
    // const options = this.wishifiedsApi.getRequestOptionWithEatHeader();

    return this.http
               .get(getListingsByUserUrl)
               .pipe(
                 map(res => {
                   return res.json().listings as Listing[];
                 }),
                 catchError( (error: Response) => {
                   return Observable.throw(error);
                 })
               );
  }

  createListing(listingData: any): Observable<Listing> {
    const createListingUrl = this.wishifiedsApi.routes.createListing;
    const options = this.wishifiedsApi.getRequestOptionWithEatHeader();

    return this.http
               .post(createListingUrl, JSON.stringify({listingData: listingData}), options)
               .pipe(
                 map( res => {
                   console.log("SUCCESS Create Listing: ", res);
                   return res.json().listing as Listing;
                 }),
                 catchError( (error: Response) => {
                   return Observable.throw(error);
                 })
               );
  }

  updateListing(listingData: any): Observable<Listing> {
    const updateListingUrl = this.wishifiedsApi.buildUrl('updateListing', [{':id': listingData.id}]);
    const options = this.wishifiedsApi.getRequestOptionWithEatHeader();

    return this.http
               .put(updateListingUrl, JSON.stringify({listingData: listingData}), options)
               .pipe(
                 map( res => {
                   console.log("SUCCESS Update Listing: ", res);
                   return res.json().listing as Listing;
                 }),
                 catchError( (error: Response) => {
                   return Observable.throw(error);
                 })
               );
  }
}
