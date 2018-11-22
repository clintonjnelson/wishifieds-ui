import { Component, Input, Output, ViewChild, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { IconService } from '../core/services/icon.service';
import { HelpersService } from '../shared/helpers/helpers.service';
import { AuthService } from '../core/auth/auth.service';
import { ApiMessagesService } from '../core/api/api-messages.service';
import { Listing } from './listing.model';
import { NguCarousel } from '@ngu/carousel';
import { MatBadgeModule } from '@angular/material';



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

  ngOnInit() {
    this.currentViewerId = this.authService.auth.userId;
    this.isOwner = this.helpers.isEqualStrInt(this.listing.userId, this.currentViewerId);
    this.getCorrespondantMessagesInfo();
    console.log("IS OWNER IS, listindOwner, currentViewer: ", this.isOwner, this.listing.userId, this.currentViewerId);
  }

  carouselLoaded(event: Event) {
    console.log("Carousel has loaded: ", event);
  }
  // carouselMoved(data: NguCarouselStore) {
  //   console.log("Carousel moved: ", data);
  // }

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
    // let username = window.localStorage.getItem('username');
    // TODO: Should have a saved page that the user came from
    // TODO: Go back to that previously loaded page
    this.toggleEditing(false);
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
