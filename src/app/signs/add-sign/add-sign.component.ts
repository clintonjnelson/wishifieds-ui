import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HelpersService } from '../../shared/helpers/helpers.service';
import { Sign } from '../sign.model';

export class Link {
  url:      string;
  icon:     string;
  bgColor:  string;
  linkName: string;
}

const OLINKS: Link[] = [
  {url: 'www.google.com', icon: 'facebook',  bgColor: 'green',  linkName: 'facebook'},
  {url: 'www.google.com', icon: 'instagram', bgColor: 'blue',   linkName: 'instagram'},
  {url: 'www.google.com', icon: 'linkedin',  bgColor: 'red',    linkName: 'linkedin'},
  {url: 'www.google.com', icon: 'vine',      bgColor: 'orange', linkName: 'vine'},
  {url: 'www.google.com', icon: 'reddit',    bgColor: 'yellow', linkName: 'reddit'},
  {url: 'www.google.com', icon: 'snapchat',  bgColor: 'purple', linkName: 'snapchat'},
  {url: 'www.google.com', icon: 'pinterest', bgColor: 'black',  linkName: 'pinterest'}
];

const CUSTOM_SIGNS: Sign[] = [
  { signName: 'podcast', signType: 'custom', bgColor: 'red', icon: 'podcast',
    _id: '', description: '', knownAs: '', linkUrl: '#', picUrl: '', username: '', owner: '' },
  { signName: 'etsy', signType: 'custom', bgColor: 'blue', icon: 'etsy',
    _id: '', description: '', knownAs: '', linkUrl: '#', picUrl: '', username: '', owner: '' },
  { signName: 'quora', signType: 'custom', bgColor: 'brown', icon: 'quora',
    _id: '', description: '', knownAs: '', linkUrl: '#', picUrl: '', username: '', owner: '' },
  { signName: 'meetup', signType: 'custom', bgColor: 'yellow', icon: 'meetup',
    _id: '', description: '', knownAs: '', linkUrl: '#', picUrl: '', username: '', owner: '' },
  { signName: 'website', signType: 'custom', bgColor: 'green', icon: 'globe',
    _id: '', description: '', knownAs: '', linkUrl: '#', picUrl: '', username: '', owner: '' },
  { signName: 'digg', signType: 'custom', bgColor: 'orange', icon: 'digg',
    _id: '', description: '', knownAs: '', linkUrl: '#', picUrl: '', username: '', owner: '' },
  { signName: 'amazon', signType: 'custom', bgColor: 'yellow', icon: 'amazon',
    _id: '', description: '', knownAs: '', linkUrl: '#', picUrl: '', username: '', owner: '' },
  { signName: 'angellist', signType: 'custom', bgColor: 'green', icon: 'angellist',
    _id: '', description: '', knownAs: '', linkUrl: '#', picUrl: '', username: '', owner: '' },
  { signName: 'flickr', signType: 'custom', bgColor: 'black', icon: 'flickr',
    _id: '', description: '', knownAs: '', linkUrl: '#', picUrl: '', username: '', owner: '' },
  { signName: 'houzz', signType: 'custom', bgColor: 'purple', icon: 'houzz',
    _id: '', description: '', knownAs: '', linkUrl: '#', picUrl: '', username: '', owner: '' },
  { signName: 'spotify', signType: 'custom', bgColor: 'green', icon: 'spotify',
    _id: '', description: '', knownAs: '', linkUrl: '#', picUrl: '', username: '', owner: '' },
]

// HOW SHOW THE PHONE & EMAIL SIGNS?????
const GENERIC_SIGNS: Sign[] = [
  { signName: 'phone', signType: 'generic', bgColor: 'purple', icon: 'phone',
    _id: '', description: '', knownAs: '', linkUrl: '#', picUrl: '#', username: '', owner: '' },
  { signName: 'email', signType: 'generic', bgColor: 'black', icon: 'envelope',
    _id: '', description: '', knownAs: '', linkUrl: '#', picUrl: '#', username: '', owner: '' },
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

