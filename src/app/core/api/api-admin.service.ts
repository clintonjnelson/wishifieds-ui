import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { WishifiedsApi } from '../api/wishifieds-api.service';
import { User } from '../../users/user.model';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()

export class ApiAdminService {
  constructor(private http:        Http,
              private wishifiedsApi: WishifiedsApi) {}

  getUsers(): Observable<User[]> {
    const getUsersUrl = this.wishifiedsApi.routes.adminGetUsers;
    const options     = this.wishifiedsApi.getRequestOptionWithEatHeader();

    return this.http
               .get(getUsersUrl, options)
               .map( res => {
                 console.log("SUCCESS ADMIN GET USERS: ", res);
                 return res.json().users as User[];
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }

  updateSitemap(): Observable<any> {
    const updateSitemapUrl = this.wishifiedsApi.routes.adminUpdateSitemap;
    const options          = this.wishifiedsApi.getRequestOptionWithEatHeader();

    return this.http
               .put(updateSitemapUrl, JSON.stringify({trigger: true}), options)
               .map( res => {
                 console.log("Success updating sitemap: ", res);
                 return res.json();
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }

  // userCleanup(): Observable<any> {
  //   const userCleanupUrl = this.wishifiedsApi.routes.adminUserCleanup;
  //   const options        = this.wishifiedsApi.getRequestOptionWithEatHeader();

  //   return this.http
  //              .put(userCleanupUrl, JSON.stringify({trigger: true}), options)
  //              .map( res => {
  //                console.log("Success cleaning up users", res);
  //                return res.json();
  //              })
  //              .catch( (error: Response) => {
  //                return Observable.throw(error);
  //              });
  // }
}
