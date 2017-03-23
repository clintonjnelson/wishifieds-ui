import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HelpersService } from '../../shared/helpers/helpers.service';
import { Sign } from '../sign.model';

export class Link {
  url:      string;
  icon:     string;
  bgColor:  string;
  linkName: string;
}

// Move this to the DB?
const OLINKS: Link[] = [
  {url: '/api/auto/facebook',      icon: 'facebook',      bgColor: 'green',  linkName: 'facebook'},
  {url: '/api/auto/instagram',     icon: 'instagram',     bgColor: 'blue',   linkName: 'instagram'},
  {url: '/api/auto/linkedin',      icon: 'linkedin',      bgColor: 'red',    linkName: 'linkedin'},
  {url: '/api/auto/github',        icon: 'github',        bgColor: 'orange', linkName: 'github'},
  {url: '/api/auto/twitter',       icon: 'twitter',       bgColor: 'yellow', linkName: 'twitter'},
  {url: '/api/auto/google',        icon: 'google',        bgColor: 'purple', linkName: 'google'},
  {url: '/api/auto/wordpress',     icon: 'wordpress',     bgColor: 'black',  linkName: 'wordpress'},
  {url: '/api/auto/stackexchange', icon: 'stackoverflow', bgColor: 'green',  linkName: 'stackoverflow'},
];

// Move this to the DB?
const CUSTOM_SIGNS: Sign[] = [
  { signName: 'podcast', signType: 'custom', bgColor: 'red', icon: 'podcast',
    _id: '', description: '', knownAs: '', linkUrl: '#', picUrl: '', userId: '' },
  { signName: 'etsy', signType: 'custom', bgColor: 'blue', icon: 'etsy',
    _id: '', description: '', knownAs: '', linkUrl: '#', picUrl: '', userId: '' },
  { signName: 'quora', signType: 'custom', bgColor: 'brown', icon: 'quora',
    _id: '', description: '', knownAs: '', linkUrl: '#', picUrl: '', userId: '' },
  { signName: 'meetup', signType: 'custom', bgColor: 'yellow', icon: 'meetup',
    _id: '', description: '', knownAs: '', linkUrl: '#', picUrl: '', userId: '' },
  { signName: 'website', signType: 'custom', bgColor: 'green', icon: 'globe',
    _id: '', description: '', knownAs: '', linkUrl: '#', picUrl: '', userId: '' },
  { signName: 'digg', signType: 'custom', bgColor: 'orange', icon: 'digg',
    _id: '', description: '', knownAs: '', linkUrl: '#', picUrl: '', userId: '' },
  { signName: 'amazon', signType: 'custom', bgColor: 'yellow', icon: 'amazon',
    _id: '', description: '', knownAs: '', linkUrl: '#', picUrl: '', userId: '' },
  { signName: 'angellist', signType: 'custom', bgColor: 'green', icon: 'angellist',
    _id: '', description: '', knownAs: '', linkUrl: '#', picUrl: '', userId: '' },
  { signName: 'flickr', signType: 'custom', bgColor: 'black', icon: 'flickr',
    _id: '', description: '', knownAs: '', linkUrl: '#', picUrl: '', userId: '' },
  { signName: 'houzz', signType: 'custom', bgColor: 'purple', icon: 'houzz',
    _id: '', description: '', knownAs: '', linkUrl: '#', picUrl: '', userId: '' },
  { signName: 'spotify', signType: 'custom', bgColor: 'green', icon: 'spotify',
    _id: '', description: '', knownAs: '', linkUrl: '#', picUrl: '', userId: '' },
]

// HOW SHOW THE PHONE & EMAIL SIGNS?????
const GENERIC_SIGNS: Sign[] = [
  { signName: 'phone', signType: 'generic', bgColor: 'purple', icon: 'phone',
    _id: '', description: '', knownAs: '', linkUrl: '#', picUrl: '#', userId: '' },
  { signName: 'email', signType: 'generic', bgColor: 'black', icon: 'envelope',
    _id: '', description: '', knownAs: '', linkUrl: '#', picUrl: '#', userId: '' },
];




@Component({
  moduleId: module.id,
  selector: 'add-sign',
  templateUrl: 'add-sign.component.html',
  styleUrls:  ['add-sign.component.css']
})

export class AddSignComponent {
  oauths: Link[] = OLINKS;
  customs: Sign[] = CUSTOM_SIGNS;
  selectedSign: Sign;

  showAddSignIcons: boolean = false;
  showSignForm: boolean = false;
  @Input()  signs: Sign[];
  @Output() saveEE  = new EventEmitter<any>()
  @Output() destroyEE = new EventEmitter<any>();
  // MAYBE: TO ENABLE DYNAMIC SIGN TYPE UPDATE, LISTEN VIA NEW @OUTPUT FOR CHANGES,
  // WOULD PROBABLY HAVE TO BE SENT UPON EACH KEYSTROKE OR SOMETHING LIKE THAT.
  // THEN CAPTURE DATA & SEND BACK THE TYPE-CHANGED SIGN WITH USER'S FORM DATA
  // UDPATED IN THIS SIGN. THEN WONT HAVE TO TURN OFF TYPES AFTER SELECTION.
  // WOULD HAVE ONE SELECTED_SIGN THAT GETS UPDATES WITH ONLY TYPE & COLOR & ICON
  // WHEN ANOTHER TYPE IS CHANGED.

  constructor(private helpers: HelpersService) {}

  isOauthAdded(checkLink: Link): boolean {
    var returnVal = false;
    this.signs.forEach(function(elem: Sign, ind: Number, orig: Sign[]) {
      if(elem.signName === checkLink.linkName) {
        returnVal = true;
      }
    });
    return returnVal;
  }

  // Set the sign to create RENAME: SET_CREATE_SIGN, SELECTED_CREATE_SIGN
  setSign(sign: Sign) {
    this.selectedSign = sign;
    this.toggleShowAddSignIcons(false);
    console.log("SETTING SIGN TO: ", sign);
  }

  // Functions for Bubbling Up
  destroy(event: any) {
    console.log("IN ADD-SIGN DESTROY FUNCTION; EVENT IS ", event);
    // SHOULD NEVER NEED THIS ON AN ADD-SIGN AREA; ONLY ON NORMAL SIGN.
    // if(!!event.sign && event.destroy === true) {
    //   this.destroyEE.emit(event);
    // }
    this.toggleShowForm(false);
  }
  save(event: any) {
    var newSign = event;
    if(!event._id) { newSign._id = this.signs.length; }
    console.log("SIGN AT THE ADDSIGN LEVEL IS: ", newSign);
    // Reset the area to closed. Triggered by event emitters from inner save/close
    this.closeForms();
    this.saveEE.emit(newSign);    // keep passing the sign up
  }

  // Toggle Control Functions
  private closeForms() {
    this.toggleShowAddSignIcons(false);
    this.toggleShowForm(false);
  }
  toggleShowAddSignIcons(input: any = null): void {
    // If setting value directly, do that. Else, just toggle the value
    if(typeof(input) === 'boolean') { this.showAddSignIcons = input; }
    else { this.showAddSignIcons = !this.showAddSignIcons; }
  }
  toggleShowForm(input: any = null):void {
    // If setting value directly, do that. Else, just toggle the value
    if(typeof(input) === 'boolean') { this.showSignForm = input; }
    else { this.showSignForm = !this.showSignForm; }
  }
}

