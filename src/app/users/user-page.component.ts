import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params }               from '@angular/router';
import { AuthService, UserAuth }        from '../core/auth/auth.service';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';

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

  constructor( private authService:     AuthService,
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
