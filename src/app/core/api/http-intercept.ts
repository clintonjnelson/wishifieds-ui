import { Injectable } from '@angular/core';
import { Http, ConnectionBackend, Headers, RequestOptions, RequestOptionsArgs, Request, Response } from '@angular/http';
// import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth/auth.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()

export class HttpIntercept extends Http {
  constructor(backend:               ConnectionBackend,
              defaultOptions:        RequestOptions,
              private authService:   AuthService) {
    super(backend, defaultOptions);
  }

  // Catches inner Observable first, if nothing then returns full Observable for catching later
  intercept(observable: Observable<Response>): Observable<Response> {
    const that = this;
    // Intercept observable before returning it to caller
    return observable.catch( res => {
      // Check for trigger to reset EAT
      try {
        console.log("RES BEFORE IS: ", res);
        const body = res.json();
        console.log("ERROR STATUS IS: ", res.status, " AND TYPE IS: ", typeof res.status);
        console.log("BODY IS: ", body);
        console.log("ORIG RES IS: ", res);

        // Direct server commanded reset
        if(res.status === 401 && body.reset) {
          console.log("RESETTING...");
          that.authService.logout();   // deletes cookies, reset auth values, redirect home
          return Observable.empty<Response>();
        }
        // Continue as normal
        else {
          return observable;
        }
      }
      catch (e) {
        // If Error, may be because body is index file for graceful oauth errors
        // In such case, look for SyntaxError & 401 Status => reset intended
        if(e instanceof SyntaxError && res.status === 401) {
          that.authService.logout();
          return Observable.empty<Response>();
        }
        else { return observable; }
      }
    });
  }


  // Default headers being added to the OUTGOING request
  getCustomOrDefaultOptionsArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
    if(!options)                             { options         = new RequestOptions(); }
    if(!options.headers)                     { options.headers = new Headers();        }
    if(!options.headers.has('Content-Type')) { options.headers.append('Content-Type', 'application/json'); }

    return options;
  }

  // Basic HTTP Methods to Override
  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.request(url, options));
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.get(url, options));
  }

  post(url: string, json: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.post(url, json, this.getCustomOrDefaultOptionsArgs(options)));
  }

  put(url: string, json: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.put(url, json, this.getCustomOrDefaultOptionsArgs(options)));
  }

  patch(url: string, json: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.patch(url, json, this.getCustomOrDefaultOptionsArgs(options)));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.delete(url, this.getCustomOrDefaultOptionsArgs(options)));
  }
}

