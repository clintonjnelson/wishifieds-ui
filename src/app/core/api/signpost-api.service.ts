import { Injectable } from '@angular/core';
import { Headers    } from '@angular/http';

// List of Signpost API Routes used in the UI
const ROUTES = {
  // Auth
  login:  '/api/login',
  logout: '/api/logout',

  // Users
  createUser:  '/api/users',
  getUserById: '/api/users/:usernameOrId',

  // Signs
  getSignsByUsernameOrId: '/api/signs/:usernameOrId',
  createSign:             '/api/signs',
  destroySign:            '/api/signs',
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
    };
  }

  // eat (encrypted authentication token) is required on each request
  getEatAuthCookie() {
    return window.localStorage.getItem('eatAuthToken');
  }

  headerUpsert(headers: Headers, name: string, value: string) {
    // Update if already exists, else add new header
    if(headers.has(name)) { return headers.set(   name, value) }
    else                  { return headers.append(name, value) }
  }

  upsertEatHeader(headers: Headers) {
    const that = this;
    return this.headerUpsert(headers, 'eat', that.getEatAuthCookie());
  }

  buildUrl(routeName: string, substitutions: Object[]): string {
    const baseUrl = this.routes[routeName];
    console.log("BASE URL IS: ", baseUrl);
    console.log("subs IS: ", substitutions);
    // Runs each of the substitutions, returning the final URL
    return substitutions.reduce( (priorResult, currentSubstitution) => {
        let sub = Object.keys(currentSubstitution)[0];
        let val = currentSubstitution[sub];
        return priorResult.replace(sub, val);
      },
      baseUrl  // Initial value of string
    );
  }
}
