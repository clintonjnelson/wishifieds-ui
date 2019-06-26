import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { WishifiedsApi } from '../api/wishifieds-api.service';
import { map, catchError } from 'rxjs/operators';


@Injectable()

export class ApiTagsService {
  constructor(private http:          Http,
              private wishifiedsApi: WishifiedsApi) {}

  getTag(nameOrId: any): Observable<any> {
    const getTagByNameOrIdUrl = this.wishifiedsApi.buildUrl('getTagByNameOrId', [ {':nameOrId': nameOrId} ] );

    return this.http
               .get(getTagByNameOrIdUrl)
               .pipe(
                 map( res => {
                   console.log("SUCCESS GET TAGS: ", res);
                   return res.json();
                 }),
                 catchError( (error: Response) => {
                   return throwError(error);
                 })
               );
  }

  createTag(tagName: string): Observable<any> {
    const createTagUrl = this.wishifiedsApi.routes.createTag;
    const options    = this.wishifiedsApi.getRequestOptionWithEatHeader();

    return this.http
               .post(createTagUrl, JSON.stringify({name: tagName}), options)
               .pipe(
                 map( res => {
                   console.log("SUCCESS CREATING TAG", res);
                   return res.json();
                 }),
                 catchError( (error: Response) => {
                   return throwError(error);
                 })
               );
  }
}
