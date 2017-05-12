import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SignpostApi } from './signpost-api.service';
import { Sign } from '../../signs/sign.model';
import { User } from '../../users/user.model';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

class SearchResults {
  signs: Sign[];
  users: User[];
}


@Injectable()

export class ApiSearchService {

  constructor(private http:        Http,
              private signpostApi: SignpostApi) {}

  // Search for signs or users
  search(searchStr: string): Observable<SearchResults> {
    console.log("IN FUNCTION iS: ", searchStr);
    const searchUrl = this.signpostApi.buildUrl('search', [{':searchStr': searchStr}]);
    return this.http
               .get(searchUrl)
               .map( res => {
                 console.log("SUCCESS SEARCH: ", res);
                 return res.json() as SearchResults;
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }
}
