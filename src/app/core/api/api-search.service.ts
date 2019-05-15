import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { WishifiedsApi } from '../api/wishifieds-api.service';
import { Listing } from '../../listings/listing.model';
import { map, catchError } from 'rxjs/operators';


@Injectable()

export class ApiSearchService {
  constructor(private http:          Http,
              private wishifiedsApi: WishifiedsApi) {}

  searchListings(searchStr: string): Observable<Listing[]> {
    const searchListingsUrl = this.wishifiedsApi.buildUrl('searchListings', [{':searchStr': searchStr}]);

    return this.http
               .get(searchListingsUrl)
               .pipe(
                 map( res => {
                   console.log("SUCCESS GET (search) Listings: ", res);
                   return res.json().listings as Listing[];
                 }),
                 catchError( (error: Response) => {
                   return throwError(error);
                 })
               );
  }
}
