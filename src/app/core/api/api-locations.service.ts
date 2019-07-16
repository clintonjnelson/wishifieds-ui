import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { WishifiedsApi } from '../api/wishifieds-api.service';
import { map, catchError } from 'rxjs/operators';


@Injectable()

export class ApiLocationsService {
  constructor(private http:          Http,
              private wishifiedsApi: WishifiedsApi) {}

  locationTypeahead(postal: string = '', city: string = '', state: string = '', maxresults: string = '7'): Observable<any> {
    const locationTypeaheadUrl = this.wishifiedsApi.buildUrl(
      'locationTypeahead',
      [
        { ':postal': postal },
        { ':city': city },
        { ':statecode': state },
        { ':maxresults': maxresults }
      ]
    );

    return this.http
               .get(locationTypeaheadUrl)
               .pipe(
                 map( res => {
                   console.log("SUCCESS TYPEAHEAD LOCATIONS: ", res);
                   return res.json();
                 }),
                 catchError( (error: Response) => {
                   return throwError(error);
                 })
               );
  }
}
