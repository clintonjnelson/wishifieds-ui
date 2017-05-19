import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MdTooltipModule } from '@angular/material';
import { HelpersService }  from '../../shared/helpers/helpers.service';
import { IconService }     from '../../core/services/icon.service';
import { Sign }            from '../sign.model';

export class Link {
  url:      string;
  icon:     string;
  bgColor:  string;
  linkName: string;
}
export class SignAddType {
  icon:     string;
  bgColor:  string;
  signType: string;
  signName: string;
}

// Move this to the DB?
const OLINKS: Link[] = [
  // {url: '/api/auto/amazon',        icon: 'amazon',         bgColor: '#ff9900', linkName: 'amazon'},
  {url: '/api/auto/deviantart',    icon: 'deviantart',     bgColor: '#b3c432', linkName: 'deviantart'},
  {url: '/api/auto/disqus',        icon: 'disqus',         bgColor: '#2e9fff', linkName: 'disqus'},
  {url: '/api/auto/etsy',          icon: 'etsy',           bgColor: '#d15600', linkName: 'etsy'},
  {url: '/api/auto/facebook',      icon: 'facebook',       bgColor: '#3b5998', linkName: 'facebook'},
  {url: '/api/auto/foursquare',    icon: 'foursquare',     bgColor: '#f94877', linkName: 'foursquare'},
  {url: '/api/auto/instagram',     icon: 'instagram',      bgColor: '#675144', linkName: 'instagram'},
  {url: '/api/auto/linkedin',      icon: 'linkedin',       bgColor: '#4875B4', linkName: 'linkedin'},
  {url: '/api/auto/github',        icon: 'github',         bgColor: '#333333', linkName: 'github'},
  {url: '/api/auto/twitter',       icon: 'twitter',        bgColor: '#00aced', linkName: 'twitter'},
  {url: '/api/auto/google',        icon: 'google',         bgColor: '#dd4b39', linkName: 'google'},
  {url: '/api/auto/pinterest',     icon: 'pinterest',      bgColor: '#cb2027', linkName: 'pinterest'},
  {url: '/api/auto/reddit',        icon: 'reddit',         bgColor: '#FF5700', linkName: 'reddit'},
  {url: '/api/auto/spotify',       icon: 'spotify',        bgColor: '#00e461', linkName: 'spotify'},
  {url: '/api/auto/tumblr',        icon: 'tumblr',         bgColor: '#35465c', linkName: 'tumblr'},
  {url: '/api/auto/vimeo',         icon: 'vimeo',          bgColor: '#00bf8f', linkName: 'vimeo'},
  {url: '/api/auto/vkontakte',     icon: 'vk',             bgColor: '#45668e', linkName: 'vk'},
  {url: '/api/auto/wordpress',     icon: 'wordpress',      bgColor: '#21759b', linkName: 'wordpress'},
  {url: '/api/auto/stackexchange', icon: 'stack-overflow', bgColor: '#5184C1', linkName: 'stackoverflow'},
  {url: '/api/auto/youtube',       icon: 'youtube',        bgColor: '#bb0000', linkName: 'youtube'},
  {url: '/api/login/disqus',       icon: 'disqus',         bgColor: '#2e9fff', linkName: 'disqus'},
  {url: '/api/login/imgur',        icon: 'imgur',          bgColor: '#85bf25', linkName: 'imgur'},
  {url: '/api/login/patreon',      icon: 'patreon',        bgColor: '#e6461a', linkName: 'patreon'},
];

// Move this to the DB?
const CUSTOM_SIGNS: SignAddType[] = [
  { icon: 'globe',       bgColor: 'green',   signType: 'custom', signName: '' },
  { icon: 'podcast',     bgColor: '#9C27B0', signType: 'custom', signName: '' },
  { icon: 'amazon',      bgColor: '#ff9900', signType: 'custom', signName: '' },
  { icon: 'quora',       bgColor: '#AA2200', signType: 'custom', signName: '' },
  { icon: 'meetup',      bgColor: '#E51937', signType: 'custom', signName: '' },
  { icon: 'rss',         bgColor: '#ff7900', signType: 'custom', signName: '' },
  { icon: 'flickr',      bgColor: '#ff0084', signType: 'custom', signName: '' },
  { icon: 'houzz',       bgColor: '#7ac142', signType: 'custom', signName: '' },
  { icon: 'vine',        bgColor: '#00b488', signType: 'custom', signName: '' },
  { icon: 'snapchat',    bgColor: '#fffc00', signType: 'custom', signName: '' },
  { icon: 'medium',      bgColor: '#00ab6c', signType: 'custom', signName: '' },
  { icon: 'qq',          bgColor: '#009BD9', signType: 'custom', signName: '' },
  { icon: 'behance',     bgColor: '#1769ff', signType: 'custom', signName: '' },
  { icon: 'steam',       bgColor: '#00adee', signType: 'custom', signName: '' },
  { icon: 'stumbleupon', bgColor: '#eb4924', signType: 'custom', signName: '' },
  { icon: 'twitch',      bgColor: '#6441a5', signType: 'custom', signName: '' },
  { icon: 'wechat',      bgColor: '#7bb32e', signType: 'custom', signName: '' },
  { icon: 'whatsapp',    bgColor: '#25d366', signType: 'custom', signName: '' },
  { icon: 'yelp',        bgColor: '#af0606', signType: 'custom', signName: '' },
  { icon: 'ebay',        bgColor: '#f5af02', signType: 'custom', signName: '' },
];

// HOW SHOW THE PHONE & EMAIL SIGNS?????
const GENERIC_SIGNS: SignAddType[] = [
  { icon: 'phone',    bgColor: 'purple', signType: 'generic', signName: 'phone' },
  { icon: 'envelope', bgColor: 'black',  signType: 'generic', signName: 'email' },
];



@Component({
  moduleId: module.id,
  selector: 'add-sign',
  templateUrl: 'add-sign.component.html',
  styleUrls:  ['add-sign.component.css']
})

export class AddSignComponent {
  oauths: Link[]   = OLINKS;                      // Oauth for fontawesome icons
  customs: Sign[]  = this.buildSigns(CUSTOM_SIGNS);               // Custom Sign with fontawesome icons
  generics: Sign[] = this.buildSigns(GENERIC_SIGNS);
  selectedSign: Sign;

  showAddSignIcons = false;
  showSignForm     = false;
  @Input()  signs: Sign[];
  @Output() saveEE  = new EventEmitter<any>();
  @Output() destroyEE = new EventEmitter<any>();
  // MAYBE: TO ENABLE DYNAMIC SIGN TYPE UPDATE, LISTEN VIA NEW @OUTPUT FOR CHANGES,
  // WOULD PROBABLY HAVE TO BE SENT UPON EACH KEYSTROKE OR SOMETHING LIKE THAT.
  // THEN CAPTURE DATA & SEND BACK THE TYPE-CHANGED SIGN WITH USER'S FORM DATA
  // UDPATED IN THIS SIGN. THEN WONT HAVE TO TURN OFF TYPES AFTER SELECTION.
  // WOULD HAVE ONE SELECTED_SIGN THAT GETS UPDATES WITH ONLY TYPE & COLOR & ICON
  // WHEN ANOTHER TYPE IS CHANGED.

  buildSigns(signAddTypes: SignAddType[] ): Sign[] {
    return signAddTypes.map(function(sign) {
      return { icon:        sign.icon,
               bgColor:     sign.bgColor,
               signName:    sign.signName,
               signType:    sign.signType,
               _id:         '',
               description: '',
               knownAs:     '',
               linkUrl:     '',
               picUrl:      '',
               userId:      '',
             };
    });
  }

  constructor(private helpers: HelpersService,
              private icons:   IconService) {}

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  isOauthAdded(checkLink: Link): boolean {
    let returnVal = false;
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
    this.toggleShowForm(false);
  }
  save(event: any) {
    let newSign = event;
    if(!event._id) { newSign._id = this.signs.length; }
    console.log("SIGN AT THE ADDSIGN LEVEL IS: ", newSign);
    // Reset the area to closed. Triggered by event emitters from inner save/close
    this.closeForms();

    // Format the linkUrl as needed:
    newSign.linkUrl = this.helpers.verifyOrAddProtocolToUrl(newSign.linkUrl);
    console.log("VERIFY URL FORMATTING OCCURED: ", newSign.linkUrl);

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

