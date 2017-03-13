import { Injectable } from '@angular/core';
import { Headers    } from '@angular/http';
import { AuthService } from '../auth/auth.service';

// List of Signpost API Routes used in the UI
const ROUTES = {
  // Auth
  login: '/api/login',
  logout: '/api/logout',

  // Users
  createUser:  '/api/users',
  getUserById: '/api/users/:usernameOrId'
};


@Injectable()

export class SignpostApi {
  routes  = ROUTES;
  headers: any;

  constructor() {  //private authService: AuthService) {
    this.headers = {
      contentType: {
        appJson: (new Headers({'Content-Type': 'application/json'})),
      },
    };
  }

  // eat (encrypted authentication token) is required on each request
  // getEatAuthCookieHeader() {
  //   const eatCookie = this.authService.getEatCookie();
  //   return new Headers( {eat: eatCookie} );
  // }

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
