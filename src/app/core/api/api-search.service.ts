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

  // Default empty query params so that will still populate properly
  searchListings(searchStr: string, distance: string = '', postal: string = '', locationId: string = ''): Observable<Listing[]> {
    const searchListingsUrl = this.wishifiedsApi.buildUrl('searchListings', [
      {':searchStr': searchStr},
      {':distance': distance},
      {':postal': postal},
      {':locationId': locationId}
    ]);
    const options = this.wishifiedsApi.getRequestOptionWithEatHeader();

    return this.http
               .get(searchListingsUrl, options)
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
