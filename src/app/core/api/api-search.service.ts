import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SignpostApi } from './signpost-api.service';
import { Sign } from '../../signs/sign.model';
import { User } from '../../users/user.model';

class SearchResults {
  signs: Sign[];
  users: User[];
}


@Injectable()

export class ApiSearchService {

  constructor(private http:        Http,
              private signpostApi: SignpostApi) {}

  search(searchStr: string): Observable<SearchResults> {
    console.log("IN FUNCTION iS: ", searchStr);
    let searchUrl = this.signpostApi.buildUrl('search', [{':searchStr': searchStr}]);
    return this.http
               .get(searchUrl)
               .map( res => {
                 console.log("SUCCESS SEARCH: ", res);
                 return res.json() as SearchResults;
               })
               .catch( error => {
                 console.log("ERROR DURING SEARCH: ", error);
                 return error.json();
               });
  }
}
