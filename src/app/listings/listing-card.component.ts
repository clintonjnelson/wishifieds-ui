import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { Router }              from '@angular/router';
import { IconService }         from '../core/services/icon.service';
import { AuthService }         from '../core/auth/auth.service';
import { ApiMessagesService }  from '../core/api/api-messages.service';
import { MatChipInputEvent }   from '@angular/material/chips';
import { HelpersService }      from '../shared/helpers/helpers.service';
import { Listing }             from './listing.model';

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


export class ListingCardComponent implements OnInit {
  @Input() listing: Listing;
  expandedInfo = false;
  price: PriceDisplay;
  listingLink: string;
  unreadMsgsCount: number = 0;
  showUnreads: boolean = false;

  constructor( private icons: IconService,
               private helpers: HelpersService,
               private router: Router,
               private messagesApi: ApiMessagesService,
               private authService: AuthService) {
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

  // Logged OUT Helpers
  toggleInfoContainerExpand(input: any = null): void {
    // Trigger GA tracking
    // this.gaClick('loginsignupexpand');

    console.log("TOGGLING TO: ", !this.expandedInfo);

    // If setting value directly, do that.
    if(typeof(input) === 'boolean') {
      this.expandedInfo = input;
    }
    // Else, just toggle the value
    else {
      this.expandedInfo = !this.expandedInfo;
    }
  }
}







