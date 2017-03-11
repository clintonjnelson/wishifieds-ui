import { Injectable } from '@angular/core';
import { Headers    } from '@angular/http';

// List of Signpost API Routes used in the UI
const ROUTES = {
  // Auth
  login: '/login',
  logout: '/logout',

  // Users
  createUser: '/users',
};


@Injectable()

export class SignpostApi {
  routes  = ROUTES;
  headers: any;

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
