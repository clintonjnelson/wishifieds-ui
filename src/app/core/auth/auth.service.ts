import { Injectable } from '@angular/core';
import { Router     } from '@angular/router';
import { Subject    } from 'rxjs/Subject';


export class UserAuth {
  isLoggedIn:  boolean;
  isLoggedOut: boolean;
  username:    string;
  // SHOULD ADD ROLE HERE FOR ADMIN ROLE
};

@Injectable()

export class AuthService {
  // This is for User Authentication Controls
  auth: UserAuth = {isLoggedIn: false, isLoggedOut: true, username: ''};
  userAuthEmit: Subject<UserAuth> = new Subject<UserAuth>();
  redirectUrl: string;
  role: string = 'admin';  // FIX THIS LATER FOR ADMIN AUTH; Should check once & be done so no foulplay

  constructor(private router: Router) {
    this.auth.isLoggedIn  = !!window.localStorage.getItem('authToken');
    this.auth.isLoggedOut = !this.auth.isLoggedIn;
    this.auth.username    = window.localStorage.getItem('username');
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

  login() {
    console.log("AUTH LOGIN CLICKED");

    // ATTEMPT TO RE-ROUTE AFTER LOGIN IF THERE"S A VALUE IN THERE
    // CLEAR THE VALUE AFTER ATTEMPTING
    this.setAuthCookies('supersecretkey', 'username');
  }

  logout() {
    console.log("AUTH LOGOUT CLICKED");
    // CLEAR THE REDIRECT URL IN HERE AS WELL TO BE SAFE
    this.deleteAuthCookies();
    this.router.navigate(['']);
  }

  updateAuthFromCookies() {
    this.auth.isLoggedIn  = !!window.localStorage.getItem('authToken');
    this.auth.isLoggedOut = !this.auth.isLoggedIn;
    this.auth.username    = window.localStorage.getItem('username');
    this.userAuthEmit.next(this.auth);
  }

  deleteAuthCookies() {
    window.localStorage.setItem('authToken', '');
    window.localStorage.setItem('username', '');
    this.updateAuthFromCookies();
  }

  // *********************** Helpers ***********************
  /// MAYBE REFACTOR THIS INTO the LOGIN Func, USING OPTIONAL PARAMS OF THESE VALUES
  /// IT WOULD THEN BE CLEAR WHAT IT"S DOING WHEN WE SET THE VALUES MANUALLY
  /// VERIFY WE DON"T NEED THE LOGIN FUNCTION TO HAVE PARAMS ANYWAY....
  setAuthCookies(authToken: string, username: string) {
    window.localStorage.setItem('authToken', authToken);
    window.localStorage.setItem('username',  username);
    this.updateAuthFromCookies();
  }
}
