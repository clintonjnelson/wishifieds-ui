import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SignpostApi } from '../api/signpost-api.service';
import { UserCreds, User } from '../../users/user.model';

@Injectable()

export class ApiUsersService {
  constructor(private http:        Http,
              private headers:     Headers,
              private signpostApi: SignpostApi) {}

  // Create a new User Account
  apiCreateUser(creds: UserCreds): Observable<User> {
    let headers = SignpostApi.headers.contentType.appJson;
    let createUserUrl = this.signpostApi.routes.createUser;
    return this.http
               .post(createUserUrl, JSON.stringify({creds}))
               .map( (res) => res.json() as User );

  }
}
