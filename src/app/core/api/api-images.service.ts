import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { WishifiedsApi } from '../api/wishifieds-api.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class ApiImagesService {
  constructor(private http:          Http,
              private wishifiedsApi: WishifiedsApi) {}

  getExternalImages(url: string): Observable<string[]> {
    const getExternalImagesUrl = this.wishifiedsApi.routes.getExternalImages;

    return this.http
               .post(getExternalImagesUrl, JSON.stringify({url: url}))
               .map( res => {
                 console.log("SUCCESS GET IMAGES: ", res);
                 return res.json().urls as string[];
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }
}
