import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SignpostApi } from './signpost-api.service';
import { Sign } from '../../signs/sign.model';

@Injectable()

export class ApiSignsService {
  constructor(private http:        Http,
              private signpostApi: SignpostApi) {}

  getSignsByUsernameOrId(usernameOrId: string): Observable<Sign[]> {
    let getSignsUrl = this.signpostApi.buildUrl('getSignsByUsernameOrId', [{':usernameOrId': usernameOrId}]);
    return this.http
               .get(getSignsUrl)
               .map( res => {
                 console.log("RESPONSE FROM GET SIGNS BY USER/ID IS: ", res);
                 return res.json().signs as Sign[];
               })
               .catch( (error: Response | any) => {
                 console.log("ERROR FROM GET SIGNS BY USER/ID IS: ", error);
                 return error;
                 // show error message to user
                 // Maybe use remote logging infrastructure
               });
  }
}

