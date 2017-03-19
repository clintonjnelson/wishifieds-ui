import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Sign } from '../signs/sign.model';
import { AuthService, UserAuth } from '../core/auth/auth.service';
import { ApiSignsService } from '../core/api/api-signs.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  moduleId: module.id,
  selector: "user-page",
  templateUrl: 'user-page.component.html',
  styleUrls:  ['user-page.component.css']
})


export class UserPageComponent {
  signs: Sign[];
  auth: UserAuth;
  authSubscription: Subscription;
  isOwner: boolean = false;
  isProcessing: boolean;

  constructor( private authService:    AuthService,
               private apiSignsService: ApiSignsService,
               private route:          ActivatedRoute ) {
    this.auth = authService.auth;
    this.authSubscription = authService.userAuthEmit.subscribe((newVal: UserAuth) => {
      this.auth = newVal;
    });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

  // TODO: GET THE USER'S SIGNS BASED ON THE USERNAME IN THE ROUTE
  ngOnInit(): void {
    const that = this;
    const usernameFromRoute = this.route.snapshot.params['username'];

    // Not dynamic. Must reload component each time. MAY NEED TO CHANGE TO OBSREVABLE AT SOME POINT
    console.log("Username from route is: ", usernameFromRoute);
    this.isOwner = this.authService.isOwner(usernameFromRoute);
    console.log("ISOWNER IS: ", this.isOwner);

    this.isProcessing = true;
    this.apiSignsService.getSignsByUsernameOrId(usernameFromRoute)
      .subscribe(
        signs => {
          console.log("SIGNS RETURNED TO USER PAGE IS: ", signs);
          that.signs = signs;  // data is structured at level above
          that.isProcessing = false;
        },
        error => {
          console.log("ERR RETURNED FROM GET BY ID: ", error);
          return error;
        }
      );
  }

  destroy(event: any) {
    console.log("MADE IT TO USER-PAGE DESTROY. SIGN IS: ", event);
    var theseSigns = this.signs;
    if(!!event.sign && event.destroy === true) {
      this.signs.splice(theseSigns.indexOf(event.sign), 1);
      console.log("TRIED TO SPLICE OUT THE SIGN...");
    }
  }

  save(event: any): void {
    // INSTEAD OF MANUALLY PUSHING, MIGHT WANT TO JUST RELOAD FROM SERVER!
    console.log("MADE IT TO USER-PAGE SAVE. SIGN IS: ", event);
    // Update Existing Sign or Create New
    let foundSign = this.signs.find(sign => { return (sign._id === event._id); });

    if(foundSign) {
      // update the sign
      let foundSignIndex = this.signs.indexOf(foundSign);
      this.signs.splice(foundSignIndex, 1, event);
    } else {
      this.signs.push(event);     // bubbles sign up, so add it to the list
    }
  }
}
