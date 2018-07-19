import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { WishifiedsApi } from '../api/wishifieds-api.service';
import { Category } from '../../shared/models/category.model';
import { Condition } from '../../shared/models/condition.model';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()

export class ApiEnumsService {
  constructor(private http:          Http,
              private wishifiedsApi: WishifiedsApi) {}

  getCategories(): Observable<Category[]> {
    const getCategoriesUrl = this.wishifiedsApi.routes.getCategories;

    return this.http
               .get(getCategoriesUrl)
               .map( res => {
                 console.log("SUCCESS GET Categories: ", res);
                 return res.json().categories as Category[];
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }

  getConditions(): Observable<Condition[]> {
    const getConditionsUrl = this.wishifiedsApi.routes.getConditions;

    return this.http
               .get(getConditionsUrl)
               .map( res => {
                 console.log("SUCCESS GETTING CONDITIONS", res);
                 return res.json().conditions as Condition[];
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }
}
