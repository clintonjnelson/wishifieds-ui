import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';


// List of Signpost API Routes used in the UI
const ROUTES = {
  // Auth
  login:  '/api/login',
  logout: '/api/logout',
  passwordResetEmail: '/api/passwordresetrequest?email=:email',
  passwordReset: '/api/resetpassword',

  // Admin
  adminGetUsers: '/api/users',
  adminUpdateSitemap: '/api/tasks/sitemap',

  // Users
  createUser:  '/api/users',
  confirmUser: '/api/auth/emailconfirmation?confirmationtoken=:confirmationtoken&email=:email',
  resendUserConfirmation: '/api/auth/resendconfirmation?id=:userId',
  getUserById: '/api/users/:usernameOrId',
  getUsernameByUserId: '/api/users/:id/username',
  getProfilePicByUserId: '/api/users/:id/profile_pic',
  updateProfilePic: '/api/users/:id/profile_pic',
  updateUser:  '/api/users/:id',
  checkAvailability: '/api/users/available?username=:username&email=:email',

  // Categories
  getCategories: '/api/categories',

  // Conditions
  getConditions: '/api/conditions',

  // Listings & listing-based resources
  getListingsByUser: '/api/listings/user/:usernameOrId',
  getListing: '/api/listings/:id',
  createListing: '/api/listings',
  updateListing: '/api/listings/:id',
  deleteListing: '/api/listings/:id',
  searchListings: '/api/listings/search?search=:searchStr',
  // TODO: We also need ?filtertype=user,filter=<user_id>, so we can filter for specific listings
  getListingMessages: '/api/listings/:id/messages?correspondant=:correspondantId',
  getListingMessagesCorrespondants: '/api/listings/:id/messages?correspondants_only=true',
  getUnreadUserListingsMessages: '/api/messages/unreads',

  // Messages
  getUserMessages: '/api/messages',
  createMessage: '/api/messages',
  updateUnreadMessagesToRead: '/api/messages/markread',
  getUserTotalUnreadMessages: '/api/messages/totalunread',

  // Search
  search: '/api/search?searchStr=:searchStr',

  // Images
  getExternalImages: '/api/external/getimages',

  // Log Interactions
  userPageVisit:    '/api/interactions/log/userpagevisit?guid=:guid&pageusername=:pageusername&userid=:userid',
  signLinkOff:      '/api/interactions/log/signlinkoff?guid=:guid&signid=:signid&signicon=:signicon&userid=:userid',

  // Interactions Data
  getUserPageInteractions:    '/api/interactions/dashboards/userpagevisit',
  getSignLinkOffInteractions: '/api/interactions/dashboards/signlinkoff',

  // social sharing
  'social-twitter': 'http://twitter.com/share?text=:text&url=:url&hashtags=:hashtags',
  'social-google': 'https://plus.google.com/share?url=:url',
  'social-facebook': 'https://www.facebook.com/sharer/sharer.php?u=:url',
};


@Injectable()

export class WishifiedsApi {
  routes = ROUTES;


  // eat (encrypted authentication token) is required on some requests
  getEatAuthCookie() {
    return window.localStorage.getItem('eatAuthToken');
  }
  getHeaderWithEat(): Headers {
    return new Headers({'eat': this.getEatAuthCookie()});
  }
  // DEPRECATED; USE HttpHeaders instead. https://angular.io/guide/http#adding-headers
  getRequestOptionWithEatHeader() {
    return new RequestOptions({headers: this.getHeaderWithEat()});
  }

  // TODO: This is the NEXT form of the headers when HttpOptions is removed. Use below as template for old.
  // getFileUploadHeaders() {
  //   const that = this;
  //   return {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'multipart/form-data',
  //       'eat': that.getEatAuthCookie()
  //       })
  //   };
  // }

  buildUrl(routeName: string, substitutions: Object[]): string {
    const baseUrl = this.routes[routeName];
    // console.log("BASE URL IS: ", baseUrl);
    // console.log("subs IS: ", substitutions);
    // Runs each of the substitutions, returning the final URL
    return substitutions.reduce( (priorResult, currentSubstitution) => {
        const sub = Object.keys(currentSubstitution)[0];
        const val = currentSubstitution[sub];
        return priorResult.replace(sub, val);
      },
      baseUrl  // Initial value of string
    );
  }
}
