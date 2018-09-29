import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { WishifiedsApi } from '../api/wishifieds-api.service';
import { Listing } from '../../listings/listing.model';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class ApiListingsService {
  constructor(private http:          Http,
              private wishifiedsApi: WishifiedsApi) {}

  createListing(listingData: any): Observable<Listing> {
    const createListingUrl = this.wishifiedsApi.routes.createListing;

    return this.http
               .post(createListingUrl, JSON.stringify({listingData: listingData}))
               .map( res => {
                 console.log("SUCCESS Create Listing: ", res);
                 return res.json().listing as Listing;
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }

  updateListing(listingData: any): Observable<Listing> {
    const updateListingUrl = this.wishifiedsApi.buildUrl('updateListing', [{':id': listingData.id}]);

    return this.http
               .put(updateListingUrl, JSON.stringify({listingData: listingData}))
               .map( res => {
                 console.log("SUCCESS Update Listing: ", res);
                 return res.json().listing as Listing;
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }
}
