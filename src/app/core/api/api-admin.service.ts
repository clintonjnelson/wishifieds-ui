import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SignpostApi } from '../api/signpost-api.service';
import { User } from '../../users/user.model';


@Injectable()

export class ApiAdminService {
  constructor(private http:        Http,
              private signpostApi: SignpostApi) {}

  getUsers(): Observable<User[]> {
    const getUsersUrl = this.signpostApi.routes.adminGetUsers;
    const options     = this.signpostApi.getRequestOptionWithEatHeader();

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
}
