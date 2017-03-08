import { Component, OnDestroy } from '@angular/core';
import { Sign } from '../signs/sign.model';
import { AuthService, UserAuth } from '../core/auth/auth.service';
import { Subscription } from 'rxjs/Subscription';

const OAUTH_FACEBOOK_SIGN: Sign = {
    _id: '12345',
    bgColor: '#3b5998',
    description: 'some sign',
    icon: 'facebook-official',
    knownAs: 'my name',
    linkUrl: 'http://facebook.com',
    picUrl: 'https://il5.picdn.net/shutterstock/videos/3178849/thumb/1.jpg',
    signName: 'facebook',
    signType: 'oauth',
    username: 'myactualusername',
    owner: 'someusername'
  };
const CUSTOM_ETSY_SIGN: Sign = {
    _id: '54321',
    bgColor: 'orange',
    description: 'etsy sign',
    icon: 'etsy',
    knownAs: 'my etsy name',
    linkUrl: 'http://etsy.com',
    picUrl: 'https://img0.etsystatic.com/161/0/98486062/iusa_75x75.48280840_n58p.jpg',
    signName: 'etsy',
    signType: 'custom',
    username: 'myetsyusername',
    owner: 'someusername'
};
const EMAIL_SIGN: Sign = {
    _id: '111111',
    bgColor: '#88B04B',
    description: 'email sign',
    icon: 'envelope',
    knownAs: 'fakeemailsomething@example.com',
    linkUrl: '',
    picUrl: '',
    signName: 'email',
    signType: 'generic',
    username: 'myemailname',
    owner: 'someusername'
};
const PHONE_SIGN: Sign = {
    _id: '555555',
    bgColor: '#964F4C',
    description: 'phone sign',
    icon: 'phone',
    knownAs: '(555)555-5555',
    linkUrl: '',
    picUrl: '',
    signName: 'phone',
    signType: 'generic',
    username: 'myphonename',
    owner: 'someusername'
};

const SIGNS: Sign[] = [OAUTH_FACEBOOK_SIGN, CUSTOM_ETSY_SIGN, EMAIL_SIGN, PHONE_SIGN];



@Component({
  moduleId: module.id,
  selector: "user-page",
  templateUrl: 'user-page.component.html',
  styleUrls:  ['user-page.component.css']
})

export class UserPageComponent {
  signs: Sign[];
  isOwner: boolean = false;
  auth: UserAuth;
  _subscription: Subscription;

  constructor( private authService: AuthService ) {
    this.auth = authService.auth;
    this._subscription = authService.userAuthEmit.subscribe((newVal: UserAuth) => {
      this.auth = newVal;
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  // TODO: GET THE USER'S SIGNS BASED ON THE USERNAME IN THE ROUTE
  ngOnInit(): void {
    this.signs = SIGNS;
    // LOOKUP USERNAME IN ROUTE & COMPARE TO USERNAME IN SESSION VIA AUTH SERVICE METHOD
    var usernameFromRoute = "USERNAME222"
    this.isOwner = ( this.authService.isOwner(usernameFromRoute) ? true : false);
    console.log("ISOWNER IS: ", this.isOwner);
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
