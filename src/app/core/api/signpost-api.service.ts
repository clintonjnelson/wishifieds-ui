import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';

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
  updateSign:             '/api/signs',
  destroySign:            '/api/signs',

  // Search
  search: '/api/search?searchStr=:searchStr'
};


@Injectable()

export class SignpostApi {
  routes = ROUTES;

  // eat (encrypted authentication token) is required on some requests
  getEatAuthCookie() {
    return window.localStorage.getItem('eatAuthToken');
  }
  getHeaderWithEat(): Headers {
    return new Headers({'eat': this.getEatAuthCookie()});
  }
  getRequestOptionWithEatHeader() {
    return new RequestOptions({headers: this.getHeaderWithEat()});
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
