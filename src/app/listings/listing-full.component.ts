import { Component, Input, Output, ViewChild, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { IconService } from '../core/services/icon.service';
import { HelpersService } from '../shared/helpers/helpers.service';
import { AuthService } from '../core/auth/auth.service';
import { ApiMessagesService } from '../core/api/api-messages.service';
import { Listing } from './listing.model';
import { MatBadgeModule } from '@angular/material';
// import { ImgCarouselComponent } from '../shared/carousel/img-carousel.component';  // NOT SURE IF NEED. TRY DELETING LATER. VERIFY IN PROD BUILD.



@Component({
  moduleId: module.id,
  selector: 'listing-full',
  templateUrl: 'listing-full.component.html',
  styleUrls: ['listing-full.component.css']
})
export class ListingFullComponent implements OnInit {
  @Input() listing: Listing;
  @Input() isPreview: boolean = false;  // TODO: MAKE THIS SET READONLY CAPABILITIES TO LISTING
  @Input() isEditing: boolean = false;  // TODO: Verify if should default this or Not.

  @Output() editingEE = new EventEmitter<boolean>();
  showMessages: boolean = false;    // MAKE THIS TOGGLED PER THE MESSAGES ICON
  showLocationMap: boolean = false;
  currentViewerId: string;
  isOwner: boolean = true;  // TODO: HOOK THIS UP; NEEDED FOR BUTTONS & SUCH.
  msgCorrespondants = [];
  unreadMessages: number;
  showingMessagesOfUserId: string = '0';
  defaultPicUrl = '/assets/profile_default.png'; // FIXME: Make this a config value set single place elsewhere
  listingLink: string;
  public carouselConfig = {
    grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
    slide: 1,
    speed: 400,
    // interval: {},
    point: {
      visible: true
    },
    load: 2,
    velocity: 0,
    touch: true,
    loop: true,
    custom: 'banner',
    easing: 'cubic-bezier(0, 0, 0.2, 1)'
  };


  constructor(private icons: IconService,
              private helpers: HelpersService,
              private router: Router,
              private authService: AuthService,
              private messagesApi: ApiMessagesService) {

  }

  // Determine who viewer is (owner or guest), so can decide content to show
  // Determine if isOwner for owner-only related parts & logic (msgs & such)
  // Get the listingLink, so can link to the listing
  ngOnInit() {
    this.currentViewerId = this.authService.auth.userId;
    this.isOwner = this.helpers.isEqualStrInt(this.listing.userId, this.currentViewerId);
    this.listingLink = this.helpers.buildUserListingLink(
      this.router,
      this.listing.ownerUsername,
      this.listing.id);
    this.getCorrespondantMessagesInfo();
    console.log("IS OWNER IS, listindOwner, currentViewer: ", this.isOwner, this.listing.userId, this.currentViewerId);
    console.log("LISTING FULL: Listing object is: ", this.listing);
  }

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  // For the a-link href generation
  verifyOrAddProtocolToUrl(url: string) {
    return this.helpers.verifyOrAddProtocolToUrl(url)
  }

  // For the a-link href display
  urlWithoutPrototol(url: string) {
    return this.helpers.urlWithoutProtocol(url);
  }

  toggleShowMessages() {
    this.showMessages = !this.showMessages;
  }

  toggleShowLocationMap() {
    this.showLocationMap = !this.showLocationMap;
  }

  toggleEditing(input: any = null): void {
    // Update the value locally
    if(typeof(input) === 'boolean') { this.isEditing = input; }
    else { this.isEditing = !this.isEditing; }

    console.log("EDITING TOGGLED & IS NOW: ", this.isEditing);
    // Emit the value back up the chain
    console.log("In listing-full. BUBBLING UP editingEE with value: ", this.isEditing);
    this.editingEE.emit(this.isEditing);
  }

  // Load any info needed for passing to messages boxes
    // If viewer is owner, then get ALL users on listing
    // If viewer is NOT owner, then VIEWER is only user needed & already have them!
  getCorrespondantMessagesInfo() {
    const that = this;
    if(this.isOwner) {
      console.log("THIS IS THE OWNER OF THE LISTING: ", this.isOwner);
      // Listing owner may be talking with many people
      this.messagesApi.getListingMessagesCorrespondants(this.listing.id)
        .subscribe(
          res => {
            console.log("CORRESPONDANTS RETURNED ARE: ", res.correspondants);
            that.msgCorrespondants = res.correspondants;
            console.log("CORRESPONDANTS ARE: ", that.msgCorrespondants);
            // Total unread messages for Listing
            that.unreadMessages = res.totalUnread;
          },
          error => {
            console.log("Error getting message correspondants: ", error);
          });
    }
    else {
      // If not owner, then owner should be only correspondant
      this.msgCorrespondants = [that.listing.userId];
    }
  }

  setMessageToShow(msgUserId) {
    this.showingMessagesOfUserId = (msgUserId === this.showingMessagesOfUserId) ? '0' : msgUserId;
    this.scrollToLatestMsg();
  }

  closeListing(): void {
    this.toggleEditing(false);

    if(window.history.length > 1) {
      window.history.back();
    }
    // If owner is viewing own listing & closes, go back to their withlistings home
    else if(this.isOwner) {
      console.log("username from auth is: ", this.authService.auth.username);
      this.router.navigate([this.authService.auth.username], { queryParams: { tab: 'wishlistings' }});
    }
    // If viewing someone else's listing, go to listings search page
    else {
      this.router.navigate(['']);
    }
  }

  private scrollToLatestMsg() {
    if(this.showingMessagesOfUserId !== '0') {
      setTimeout( () => {
        const previewEl = document.getElementsByClassName('message-preview-container')[0];
        console.log("ELEMENT TO SCROLL TO IS: ", previewEl);
        previewEl.scrollIntoView({behavior: 'smooth'});
      }, 200);
    }
  }
}
