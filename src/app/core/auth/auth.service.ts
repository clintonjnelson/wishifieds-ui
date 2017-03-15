import { Injectable } from '@angular/core';
import { Router     } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject    } from 'rxjs/Subject';
import { ApiAuthService } from '../api/api-auth.service';

// Observable libaraies
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

export class UserAuth {
  isLoggedIn:  boolean;
  isLoggedOut: boolean;
  username:    string;
  role:        string;
  userId:      string;
};

@Injectable()

export class AuthService {
  // This is for User Authentication Controls
  auth: UserAuth = {isLoggedIn: false, isLoggedOut: true, username: '', userId: '', role: ''};
  userAuthEmit: Subject<UserAuth> = new Subject<UserAuth>();
  redirectUrl: string;
  role: string = 'admin';  // FIX THIS LATER FOR ADMIN AUTH; Should check once & be done so no foulplay

  constructor(private router:      Router,
              private apiAuth:     ApiAuthService) {
    this.auth.isLoggedIn  = !!window.localStorage.getItem('eatAuthToken');
    this.auth.isLoggedOut = !this.auth.isLoggedIn;
    this.auth.username    = window.localStorage.getItem('username');
    this.auth.role        = window.localStorage.getItem('role');
    this.auth.userId      = window.localStorage.getItem('userId');
  }

  isOwner(username: string) {
    // GET USERNAME FROM SESSION STORAGE & COMPARE
    // MAYBE STORE USERNAME LOCALLY IN THIS AUTH SERVICE
    // RETURN THE COMPARISON OF USERNAMES
    return (true ? true : false);
  }

  isAdmin() {
    // FIX THIS - ONLY A TEMP HACK TO MOCK STORED USER IS AN ADMIN OR NOT
    return false; // this.role === 'admin';
  }

  login(email: string, password: string) {
    const that = this;
    var encodedCreds = window.btoa(email + ':' + password);
    console.log("ABOUT TO TRY TO LOGIN")
    this.apiAuth.apiLoginBasicAuth(encodedCreds)
      .subscribe(
        success => {
          console.log("RESPONSE IS: ", success);
          that.setAuthCookies(
            success.eat,
            success.username,
            success.userId,
            success.email,
            success.role);
        },
        error => {
          console.log("ERROR IS: ", error);
        }
      );
  }

  logout() {
    console.log("AUTH LOGOUT CLICKED");
    // CLEAR THE REDIRECT URL IN HERE AS WELL TO BE SAFE
    this.deleteAuthCookies();
    this.router.navigate(['']);
  }

  updateAuthFromCookies() {
    this.auth.isLoggedIn  = !!window.localStorage.getItem('eatAuthToken');
    this.auth.isLoggedOut = !this.auth.isLoggedIn;
    this.auth.username    = window.localStorage.getItem('username');
    this.auth.role        = window.localStorage.getItem('role');
    this.auth.userId      = window.localStorage.getItem('userId');

    this.userAuthEmit.next(this.auth);
  }

  deleteAuthCookies() {
    window.localStorage.setItem('eatAuthToken', '');
    window.localStorage.setItem('username', '');
    window.localStorage.setItem('role', '');
    window.localStorage.setItem('email', '');
    window.localStorage.setItem('userId', '');
    this.updateAuthFromCookies();
  }

  // *********************** Helpers ***********************
  getEatAuthCookie() {
    return window.localStorage.getItem('eatAuthToken');
  }

  /// MAYBE REFACTOR THIS INTO the LOGIN Func, USING OPTIONAL PARAMS OF THESE VALUES
  /// IT WOULD THEN BE CLEAR WHAT IT"S DOING WHEN WE SET THE VALUES MANUALLY
  /// VERIFY WE DON"T NEED THE LOGIN FUNCTION TO HAVE PARAMS ANYWAY....
  setAuthCookies(eatAuthToken: string,
                 username:     string,
                 userId:       string,
                 email:        string,
                 role:         string = '') {
    window.localStorage.setItem('eatAuthToken', eatAuthToken);
    window.localStorage.setItem('username',     username);
    window.localStorage.setItem('userId',       userId);
    window.localStorage.setItem('email',        email);
    window.localStorage.setItem('role',         role);
    this.updateAuthFromCookies();
  }
}