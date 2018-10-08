import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { WishifiedsApi } from '../api/wishifieds-api.service';
import { Listing } from '../../listings/listing.model';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()

export class ApiSearchService {
  constructor(private http:          Http,
              private wishifiedsApi: WishifiedsApi) {}

  searchListings(searchStr: string): Observable<Listing[]> {
    const searchListingsUrl = this.wishifiedsApi.buildUrl('searchListings', [{':searchStr': searchStr}]);

    return this.http
               .get(searchListingsUrl)
               .map( res => {
                 console.log("SUCCESS GET (search) Listings: ", res);
                 return res.json().listings as Listing[];
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }
}
