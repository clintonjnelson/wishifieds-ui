import { Injectable } from '@angular/core';
import { Router     } from '@angular/router';
import { Subject    } from 'rxjs';


export class UserAuth {
  isLoggedIn:  boolean;
  isLoggedOut: boolean;
  username:    string;
  role:        string;
  userId:      string;
  profilePicUrl: string;
};

@Injectable()

export class AuthService {
  // This is for User Authentication Controls
  auth: UserAuth = {isLoggedIn: false, isLoggedOut: true, username: '', userId: '', role: '', profilePicUrl: ''};
  userAuthEmit: Subject<UserAuth> = new Subject<UserAuth>();
  redirectUrl: string;
  role = 'user';  // FIX THIS LATER TO BE DYNAMIC; Should check once at login, set, & be done so no foulplay.

  constructor(private router: Router,) {
    this.auth.isLoggedIn  = !!window.localStorage.getItem('eatAuthToken');
    this.auth.isLoggedOut = !this.auth.isLoggedIn;
    this.auth.username    = window.localStorage.getItem('username');
    this.auth.role        = window.localStorage.getItem('role');
    this.auth.userId      = window.localStorage.getItem('userId');
    this.auth.profilePicUrl = window.localStorage.getItem('profilePicUrl');
  }

  isOwner(usernameOrId: string) {
    // Check both userId and username
    return (usernameOrId === this.auth.userId ||
            usernameOrId === this.auth.username);
  }

  isAdmin() {
    return this.auth.role === 'admin';
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
    this.auth.profilePicUrl = window.localStorage.getItem('profilePicUrl');

    this.userAuthEmit.next(this.auth);
  }

  deleteAuthCookies() {
    window.localStorage.setItem('eatAuthToken', '');
    window.localStorage.setItem('username', '');
    window.localStorage.setItem('role', '');
    window.localStorage.setItem('email', '');
    window.localStorage.setItem('userId', '');
    window.localStorage.setItem('profilePicUrl', '');
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
                 email:        string = '',
                 role:         string = '',
                 profilePicUrl: string = '') {
    // let encodedEat = encodeURIComponent(eatAuthToken);
    // console.log("SETTING THE FOLLOWING COOKIE VALUES...");
    // console.log("EAT: ", eatAuthToken);
    // console.log("USERNAME: ", username);
    // console.log("USERID: ", userId);
    // console.log("EMAIL: ", email);
    // console.log("ROLE: ", role);
    console.log("PROFILE PIC URL: ", profilePicUrl);
    window.localStorage.setItem('eatAuthToken', eatAuthToken);
    window.localStorage.setItem('username',     username);
    window.localStorage.setItem('userId',       userId);
    window.localStorage.setItem('email',        email);
    window.localStorage.setItem('role',         role);
    window.localStorage.setItem('profilePicUrl',profilePicUrl);

    // Set cookie on window.cookie for oauth tokens
    // document.cookie = 'eat=' + encodedEat;

    this.updateAuthFromCookies();
  }
}
