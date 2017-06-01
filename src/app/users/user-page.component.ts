import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params }               from '@angular/router';
import { AuthService, UserAuth }        from '../core/auth/auth.service';
import { ApiSignsService }              from '../core/api/api-signs.service';
import { ApiInteractionLoggerService }  from '../core/api/api-interaction-logger.service';
import { Sign } from '../signs/sign.model';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';

@Component({
  moduleId: module.id,
  selector: "user-page",
  templateUrl: 'user-page.component.html',
  styleUrls:  ['user-page.component.css']
})


export class UserPageComponent implements OnInit, OnDestroy {
  signs: Sign[];
  auth: UserAuth;
  authSubscription: Subscription;
  pageSubscription: Subscription;
  isOwner = false;
  isProcessing: boolean;
  usernameFromRoute: string;

  constructor( private authService:     AuthService,
               private apiSignsService: ApiSignsService,
               private route:           ActivatedRoute,
               private interactions:    ApiInteractionLoggerService ) {
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
    this.pageSubscription = this.route.params.subscribe( (params: Params) => {
      const username = params['username'];
      console.log("TRIGGERED SUBSCRIPTION THAT WATCHES PARAMS: ", params);
      that.updateUsernameBasedData(username)
    });
  }

  destroy(event: any) {
    console.log("MADE IT TO USER-PAGE DESTROY. SIGN IS: ", event);
    const theseSigns = this.signs;
    if(!!event.sign && event.destroy === true) {
      this.signs.splice(theseSigns.indexOf(event.sign), 1);
      console.log("TRIED TO SPLICE OUT THE SIGN...");
    }
  }

  save(event: any): void {
    // INSTEAD OF MANUALLY PUSHING, MIGHT WANT TO JUST RELOAD FROM SERVER!
    console.log("MADE IT TO USER-PAGE SAVE. SIGN IS: ", event);
    // Update Existing Sign or Create New
    const foundSign = this.signs.find(sign => { return (sign._id === event._id); });

    if(foundSign) {
      // update the sign
      const foundSignIndex = this.signs.indexOf(foundSign);
      this.signs.splice(foundSignIndex, 1, event);
    } else {
      this.signs.push(event);     // bubbles sign up, so add it to the list
    }
  }

  logInteraction(username) {
    console.log("INTERACTION CLICKED");
    const userId = window.localStorage.getItem('userId');
    this.interactions.logUserPageVisit(username, userId);
  }

  private updateUsernameBasedData(username: string) {
    this.usernameFromRoute = username;
    console.log("Username from route is: ", this.usernameFromRoute);

    this.isOwner = this.authService.isOwner(this.usernameFromRoute);
    console.log("ISOWNER IS: ", this.isOwner);

    this.updateSignsFromUsername(username);
    this.logInteraction(this.usernameFromRoute);
  }

  private updateSignsFromUsername(username: string) {
    const that = this;

    this.isProcessing = true;
    this.apiSignsService.getSignsByUsernameOrId(username)
        .subscribe(
          signs => {
            console.log("SIGNS RETURNED TO USER PAGE IS: ", signs);
            that.signs = signs;  // data is structured at level above
            that.isProcessing = false;
          },
          error => {
            console.log("ERR RETURNED FROM GET BY ID: ", error.json());
            return error.json();
          }
        );
  }
}
