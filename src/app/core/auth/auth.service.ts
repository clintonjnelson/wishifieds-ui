import { Injectable } from '@angular/core';
import { Router     } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject    } from 'rxjs/Subject';
import { SignpostApi } from '../api/signpost-api.service';
import { ApiAuthService } from '../api/api-auth.service';

// Observable libaraies
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

export class UserAuth {
  isLoggedIn:  boolean;
  isLoggedOut: boolean;
  username:    string;
  role:        string;
  userid:      string;
};

@Injectable()

export class AuthService {
  // This is for User Authentication Controls
  auth: UserAuth = {isLoggedIn: false, isLoggedOut: true, username: '', userid: '', role: ''};
  userAuthEmit: Subject<UserAuth> = new Subject<UserAuth>();
  redirectUrl: string;
  role: string = 'admin';  // FIX THIS LATER FOR ADMIN AUTH; Should check once & be done so no foulplay

  constructor(private router:      Router,
              private signpostApi: SignpostApi,
              private apiAuth:     ApiAuthService) {
    this.auth.isLoggedIn  = !!window.localStorage.getItem('eatAuthToken');
    this.auth.isLoggedOut = !this.auth.isLoggedIn;
    this.auth.username    = window.localStorage.getItem('username');
    this.auth.role        = window.localStorage.getItem('role');
    this.auth.userid      = window.localStorage.getItem('userid');
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
            success.userid,
            success.email,
            success.role);
        },
        error => {
          console.log("ERROR IS: ", error);
        }
      );

    this.setAuthCookies('supersecretkey', 'username', '123465', 'admin');
  }

  logout() {
    console.log("AUTH LOGOUT CLICKED");
    // CLEAR THE REDIRECT URL IN HERE AS WELL TO BE SAFE
    this.deleteAuthCookies();
    this.router.navigate(['']);
  }

  getEatCookie() {
    return window.localStorage.getItem('eatAuthToken');
  }

  updateAuthFromCookies() {
    this.auth.isLoggedIn  = !!window.localStorage.getItem('eatAuthToken');
    this.auth.isLoggedOut = !this.auth.isLoggedIn;
    this.auth.username    = window.localStorage.getItem('username');
    this.auth.role        = window.localStorage.getItem('role');
    this.auth.userid      = window.localStorage.getItem('userid');

    this.userAuthEmit.next(this.auth);
  }

  deleteAuthCookies() {
    window.localStorage.setItem('eatAuthToken', '');
    window.localStorage.setItem('username', '');
    window.localStorage.setItem('role', '');
    window.localStorage.setItem('userid', '');
    this.updateAuthFromCookies();
  }

  // *********************** Helpers ***********************
  /// MAYBE REFACTOR THIS INTO the LOGIN Func, USING OPTIONAL PARAMS OF THESE VALUES
  /// IT WOULD THEN BE CLEAR WHAT IT"S DOING WHEN WE SET THE VALUES MANUALLY
  /// VERIFY WE DON"T NEED THE LOGIN FUNCTION TO HAVE PARAMS ANYWAY....
  setAuthCookies(eatAuthToken: string,
                 username:     string,
                 userid:       string,
                 email:        string,
                 role:         string = '') {
    window.localStorage.setItem('eatAuthToken', eatAuthToken);
    window.localStorage.setItem('username',     username);
    window.localStorage.setItem('userid',       userid);
    window.localStorage.setItem('email',        email);
    window.localStorage.setItem('role',         role);
    this.updateAuthFromCookies();
  }
}
