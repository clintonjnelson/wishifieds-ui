import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params }       from '@angular/router';
import { AuthService, UserAuth }        from '../core/auth/auth.service';
import { Subscription }                 from 'rxjs/Subscription';
import { IconService }                  from '../core/services/icon.service';
import { Listing }                      from '../listings/listing.model';
import 'rxjs/add/operator/switchMap';

const LISTINGS: Listing[] = [
  {
    user_id:     "1",
    category:    "baby & kids",  // TODO: Decide if UI does the name conversion or the API
    condition:   "good",  // TODO: Decide if UI does the name conversion or the API
    title:       "Cool Thing Wanted But Description Is Way Too Long",
    description: "Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor", // sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    keywords:    "keyword, keyword, keyword, keyword",
    linkUrl:     "https://mmm.somewebsite.com/an/example/of/what/i/want",
    price:       "100",
    zipcode:     "99999",
    status:      "10",
    images:      ["http://ecx.images-amazon.com/images/I/51EOogsHt6L.jpg",
                  "http://ecx.images-amazon.com/images/I/41W4p0WkW1L.jpg",
                  "http://img.wolverineworldwide.com/is/image/WolverineWorldWide/PG49049_1_1200x735?$dw-large$"
                  ],
    imagesRef:   "12",
    slug:        "13",
    createdAt:   "14",
    updatedAt:   "15"
  },
  {
    user_id:     "1",
    category:    "baby & kids",  // TODO: Decide if UI does the name conversion or the API
    condition:   "good",  // TODO: Decide if UI does the name conversion or the API
    title:       "Cool Thing Wanted But Description Is Way Too Long",
    description: "Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor", // sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    keywords:    "keyword, keyword, keyword, keyword",
    linkUrl:     "https://mmm.somewebsite.com/an/example/of/what/i/want",
    price:       "100",
    zipcode:     "99999",
    status:      "10",
    images:      ["http://ecx.images-amazon.com/images/I/41W4p0WkW1L.jpg",
                  "http://ecx.images-amazon.com/images/I/51EOogsHt6L.jpg",
                  "http://img.wolverineworldwide.com/is/image/WolverineWorldWide/PG49049_1_1200x735?$dw-large$"
                  ],
    imagesRef:   "12",
    slug:        "13",
    createdAt:   "14",
    updatedAt:   "15"
  },
  {
    user_id:     "1",
    category:    "baby & kids",  // TODO: Decide if UI does the name conversion or the API
    condition:   "good",  // TODO: Decide if UI does the name conversion or the API
    title:       "Cool Thing Wanted But Description Is Way Too Long",
    description: "Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor", // sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    keywords:    "keyword, keyword, keyword, keyword",
    linkUrl:     "https://mmm.somewebsite.com/an/example/of/what/i/want",
    price:       "100",
    zipcode:     "99999",
    status:      "10",
    images:      ["http://img.wolverineworldwide.com/is/image/WolverineWorldWide/PG49049_1_1200x735?$dw-large$",
                  "http://ecx.images-amazon.com/images/I/41W4p0WkW1L.jpg",
                  "http://ecx.images-amazon.com/images/I/51EOogsHt6L.jpg"
                  ],
    imagesRef:   "12",
    slug:        "13",
    createdAt:   "14",
    updatedAt:   "15"
  },
  {
    user_id:     "1",
    category:    "baby & kids",  // TODO: Decide if UI does the name conversion or the API
    condition:   "good",  // TODO: Decide if UI does the name conversion or the API
    title:       "Cool Thing Wanted But Description Is Way Too Long",
    description: "Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor", // sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    keywords:    "keyword, keyword, keyword, keyword",
    linkUrl:     "https://mmm.somewebsite.com/an/example/of/what/i/want",
    price:       "100",
    zipcode:     "99999",
    status:      "10",
    images:      ["http://ecx.images-amazon.com/images/I/51EOogsHt6L.jpg",
                  "http://ecx.images-amazon.com/images/I/41W4p0WkW1L.jpg",
                  "http://img.wolverineworldwide.com/is/image/WolverineWorldWide/PG49049_1_1200x735?$dw-large$"
                  ],
    imagesRef:   "12",
    slug:        "13",
    createdAt:   "14",
    updatedAt:   "15"
  },
  {
    user_id:     "1",
    category:    "baby & kids",  // TODO: Decide if UI does the name conversion or the API
    condition:   "good",  // TODO: Decide if UI does the name conversion or the API
    title:       "Cool Thing Wanted But Description Is Way Too Long",
    description: "Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor", // sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    keywords:    "keyword, keyword, keyword, keyword",
    linkUrl:     "https://mmm.somewebsite.com/an/example/of/what/i/want",
    price:       "100",
    zipcode:     "99999",
    status:      "10",
    images:      ["http://ecx.images-amazon.com/images/I/41W4p0WkW1L.jpg",
                  "http://ecx.images-amazon.com/images/I/51EOogsHt6L.jpg",
                  "http://img.wolverineworldwide.com/is/image/WolverineWorldWide/PG49049_1_1200x735?$dw-large$"
                  ],
    imagesRef:   "12",
    slug:        "13",
    createdAt:   "14",
    updatedAt:   "15"
  },
  {
    user_id:     "1",
    category:    "baby & kids",  // TODO: Decide if UI does the name conversion or the API
    condition:   "good",  // TODO: Decide if UI does the name conversion or the API
    title:       "Cool Thing Wanted But Description Is Way Too Long",
    description: "Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor", // sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    keywords:    "keyword, keyword, keyword, keyword",
    linkUrl:     "https://mmm.somewebsite.com/an/example/of/what/i/want",
    price:       "100",
    zipcode:     "99999",
    status:      "10",
    images:      ["http://img.wolverineworldwide.com/is/image/WolverineWorldWide/PG49049_1_1200x735?$dw-large$",
                  "http://ecx.images-amazon.com/images/I/41W4p0WkW1L.jpg",
                  "http://ecx.images-amazon.com/images/I/51EOogsHt6L.jpg"
                  ],
    imagesRef:   "12",
    slug:        "13",
    createdAt:   "14",
    updatedAt:   "15"
  },
  {
    user_id:     "1",
    category:    "baby & kids",  // TODO: Decide if UI does the name conversion or the API
    condition:   "good",  // TODO: Decide if UI does the name conversion or the API
    title:       "Cool Thing Wanted But Description Is Way Too Long",
    description: "Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor", // sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    keywords:    "keyword, keyword, keyword, keyword",
    linkUrl:     "https://mmm.somewebsite.com/an/example/of/what/i/want",
    price:       "100",
    zipcode:     "99999",
    status:      "10",
    images:      ["http://ecx.images-amazon.com/images/I/41W4p0WkW1L.jpg",
                  "http://ecx.images-amazon.com/images/I/51EOogsHt6L.jpg",
                  "http://img.wolverineworldwide.com/is/image/WolverineWorldWide/PG49049_1_1200x735?$dw-large$"
                  ],
    imagesRef:   "12",
    slug:        "13",
    createdAt:   "14",
    updatedAt:   "15"
  },
  {
    user_id:     "1",
    category:    "baby & kids",  // TODO: Decide if UI does the name conversion or the API
    condition:   "good",  // TODO: Decide if UI does the name conversion or the API
    title:       "Cool Thing Wanted But Description Is Way Too Long",
    description: "Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor", // sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    keywords:    "keyword, keyword, keyword, keyword",
    linkUrl:     "https://mmm.somewebsite.com/an/example/of/what/i/want",
    price:       "100",
    zipcode:     "99999",
    status:      "10",
    images:      ["http://img.wolverineworldwide.com/is/image/WolverineWorldWide/PG49049_1_1200x735?$dw-large$",
                  "http://ecx.images-amazon.com/images/I/41W4p0WkW1L.jpg",
                  "http://ecx.images-amazon.com/images/I/51EOogsHt6L.jpg"
                  ],
    imagesRef:   "12",
    slug:        "13",
    createdAt:   "14",
    updatedAt:   "15"
  }
];


@Component({
  moduleId: module.id,
  selector: "user-page",
  templateUrl: 'user-page.component.html',
  styleUrls:  ['user-page.component.css']
})
export class UserPageComponent implements OnInit, OnDestroy {
  auth: UserAuth;
  authSubscription: Subscription;
  pageSubscription: Subscription;
  isOwner = false;
  isProcessing: boolean;
  usernameFromRoute: string;
  listings: Listing[] = LISTINGS;  // SOMEDAY GET THIS FROM API CALL FOR USER"S LISTINGS

  constructor( private authService:     AuthService,
               private icons:           IconService,
               private route:           ActivatedRoute) {
    this.auth = authService.auth;
    this.authSubscription = authService.userAuthEmit.subscribe((newVal: UserAuth) => {
      this.auth = newVal;
    });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
    this.pageSubscription.unsubscribe();
  }

  ngOnInit(): void {
    const that = this;
    // If username changes, this updates the routeParams!
    this.pageSubscription = this.route.params.subscribe( (params: Params) => {
      const username = params['username'];
      console.log("TRIGGERED SUBSCRIPTION THAT WATCHES PARAMS: ", params);
      that.updateUsernameBasedData(username)
    });
  }

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  private updateUsernameBasedData(username: string) {
    this.usernameFromRoute = username;
    console.log("Username from route is: ", this.usernameFromRoute);

    this.isOwner = this.authService.isOwner(this.usernameFromRoute);
    console.log("ISOWNER IS: ", this.isOwner);

    // this.updateSignsFromUsername(username);  // NOTE: See below
  }

  // NOTE: Sometimes updates to a user affect links on a page. Must propogate reload page data like this:
  // private updateSignsFromUsername(username: string) {
  //   const that = this;

  //   this.isProcessing = true;
  //   this.apiSignsService.getSignsByUsernameOrId(username)
  //       .subscribe(
  //         signs => {
  //           console.log("SIGNS RETURNED TO USER PAGE IS: ", signs);
  //           that.signs = signs;  // data is structured at level above
  //           that.isProcessing = false;
  //         },
  //         error => {
  //           console.log("ERR RETURNED FROM GET BY ID: ", error.json());
  //           return error.json();
  //         }
  //       );
  // }
}
