import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { WishifiedsApi } from '../api/wishifieds-api.service';
import { map, catchError } from 'rxjs/operators';


@Injectable()
export class ApiImagesService {
  constructor(private http:          Http,
              private wishifiedsApi: WishifiedsApi) {}

  getExternalImages(url: string): Observable<string[]> {
    const getExternalImagesUrl = this.wishifiedsApi.routes.getExternalImages;

    return this.http
               .post(getExternalImagesUrl, JSON.stringify({url: url}))
               .pipe(
                 map( res => {
                   console.log("SUCCESS GET IMAGES: ", res);
                   return res.json().urls as string[];
                 }),
                 catchError( (error: Response) => {
                   return Observable.throw(error);
                 })
               );
  }
}
