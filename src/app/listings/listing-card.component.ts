import { Component, ViewChild, Input, OnInit, AfterViewInit } from '@angular/core';
import { Router }              from '@angular/router';
import { IconService }         from '../core/services/icon.service';
import { AuthService }         from '../core/auth/auth.service';
import { ApiMessagesService }  from '../core/api/api-messages.service';
import { MatChipInputEvent }   from '@angular/material/chips';
import { HelpersService }      from '../shared/helpers/helpers.service';
import { Listing }             from './listing.model';
import { ImageModalService }   from '../shared/image-modal/image-modal.service';


export class PriceDisplay {
  display: string;
  symbol: string;
}

@Component({
  moduleId: module.id,
  selector: 'listing-card',
  templateUrl: 'listing-card.component.html',
  styleUrls: ['listing-card.component.css']
})


export class ListingCardComponent implements OnInit, AfterViewInit {
  @Input() listing: Listing;
  expandedInfo = false;
  price: PriceDisplay;
  listingLink: string;
  unreadMsgsCount: number = 0;
  showUnreads: boolean = false;
  ready: boolean = false;  // Page ready? Performance optimizations on what loads when.

  constructor( private icons: IconService,
               private helpers: HelpersService,
               private router: Router,
               private messagesApi: ApiMessagesService,
               private authService: AuthService,
               private imageModalService: ImageModalService) {
  }

  ngOnInit() {
    this.buildMiniPrice();
    this.listingLink = this.helpers.buildUserListingLink(
      this.router,
      this.listing.ownerUsername,
      this.listing.id);
    if(this.authService.auth.isLoggedIn && this.authService.isOwner(this.listing.userId)) {
      this.showUnreads = true;
    }

    this.setUnreads();
  }

  ngAfterViewInit() {
    const that = this;
    setTimeout(function(){this.ready = true;}.bind(that), 250);
  }

  setUnreads() {
    const that = this;
    if(this.showUnreads) {
      this.messagesApi.getListingMessagesCorrespondants(this.listing.id)
        .subscribe(
          messagesData => {
            console.log("MESSAGES INFO RECEIVED IS: ", messagesData);
            that.unreadMsgsCount = messagesData.totalUnread;
          },
          error => {
            console.log("ERROR GETTING MESSAGES DATA: ", error);
          });
    }
  }

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  buildMiniPrice() {
     this.price = this.helpers.miniPrice(this.listing.price);
  }

  // For the a-link href generation
  verifyOrAddProtocolToUrl(url: string) {
    return this.helpers.verifyOrAddProtocolToUrl(url)
  }

  // For the a-link href display
  urlWithoutPrototol(url: string) {
    return this.helpers.urlWithoutProtocol(url);
  }

  fullScreen() {
    this.imageModalService.view(this.listing.images, this.listingLink);
  }

  // FIXME?: ClOSING ALL MODALS COULD CAUSE GATCHAS ELSEWHERE... although IS before a redirect.
  redirectToListing() {
    console.log("ABOUT TO REDIRECT TO LISTING...");
    this.router.navigateByUrl(this.listingLink);
  }
}







