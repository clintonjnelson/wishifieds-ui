import { Injectable } from '@angular/core';
import { Headers    } from '@angular/http';

@Injectable()

const ROUTES = {
  // Auth
  login: '/login',
  logout: '/logout',

  // Users
  createUser: '/users',
};

export class SignpostApi {
  routes  = ROUTES;
  headers: Object;

  constructor() {
    this.headers = {
      contentType: {
        appJson: (new Headers({'Content-Type': 'application/json'})),
      },
    }
  }

  buildRoute(apiRoute: string, substitutions: Object): string {
    // substitutions: {':id': '2', ':username': 'something'}
    // BUILD THIS OUT AS NEEDED FOR ROUTE SUBSTITUTIONS
    return apiRoute;
  }
}
