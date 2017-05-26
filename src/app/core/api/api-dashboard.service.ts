import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SignpostApi } from './signpost-api.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()

export class ApiDashboardService {
  constructor( private http:        Http,
               private signpostApi: SignpostApi) {}

  // Types: signLinkOffInteractions, userPageInteractions
  getInteractions(type: string) {
    const url     = this.signpostApi.routes[type];
    const options = this.signpostApi.getRequestOptionWithEatHeader();
    console.log("URL IS: ", url);
    return this.http
               .get(url, options)
               .map( res => {
                 return res.json();
               })
               .catch( err => {
                 return Observable.throw(err);
               });
  }
}
