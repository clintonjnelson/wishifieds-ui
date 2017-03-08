import { Component } from '@angular/core';
import { User } from '../users/user.model';
import { Sign } from '../signs/sign.model';

const USERS: User[] = [
    {username: 'Jen',   picUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Official_portrait_of_Barack_Obama.jpg', status: 'active'},
    {username: 'clint', picUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/44_Bill_Clinton_3x4.jpg/220px-44_Bill_Clinton_3x4.jpg', status: 'active'}
  ];
const OAUTH_FACEBOOK_SIGN: Sign = {
    _id: '12345',
    bgColor: 'red',
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
    picUrl: 'https://il5.picdn.net/shutterstock/videos/3178849/thumb/1.jpg',
    signName: 'etsy',
    signType: 'custom',
    username: 'myetsyusername',
    owner: 'someusername'
};
const EMAIL_SIGN: Sign = {
    _id: '111111',
    bgColor: 'green',
    description: 'email sign',
    icon: 'envelope',
    knownAs: 'somereallyfakeemail@example.com',
    linkUrl: '',
    picUrl: 'https://il5.picdn.net/shutterstock/videos/3178849/thumb/1.jpg',
    signName: 'email',
    signType: 'generic',
    username: 'myemailname',
    owner: 'someusername'
};
const PHONE_SIGN: Sign = {
    _id: '555555',
    bgColor: 'blue',
    description: 'phone sign',
    icon: 'phone',
    knownAs: '(555)555-5555',
    linkUrl: '',
    picUrl: 'https://il5.picdn.net/shutterstock/videos/3178849/thumb/1.jpg',
    signName: 'phone',
    signType: 'generic',
    username: 'myphonename',
    owner: 'someusername'
};

const SIGNS: Sign[] = [OAUTH_FACEBOOK_SIGN, CUSTOM_ETSY_SIGN, EMAIL_SIGN, PHONE_SIGN];

@Component({
  moduleId: module.id,
  selector: 'livingstyleguide',
  templateUrl: 'livingstyleguide.component.html',
  styleUrls:  ['livingstyleguide.component.css']
})

export class LivingStyleGuideComponent {
  // May need to hardcode things in here for components brought in


  // SearchResultsComponent
  users = USERS;
  signs = SIGNS;

  // SignComponent
  customSign = CUSTOM_ETSY_SIGN;
  oauthSign = OAUTH_FACEBOOK_SIGN;
  emailSign   = EMAIL_SIGN;
  phoneSign   = PHONE_SIGN;

}
