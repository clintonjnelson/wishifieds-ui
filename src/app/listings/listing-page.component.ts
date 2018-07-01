import { Component, Input, ViewChild, OnInit } from '@angular/core';
// import { Router }          from '@angular/router';
import { IconService } from '../core/services/icon.service';
import { HelpersService } from '../shared/helpers/helpers.service';
// import { ApiUsersService } from '../core/api/api-users.service';
import { Listing } from './listing.model';
import { DragScrollDirective } from 'ngx-drag-scroll';
import { NguCarousel } from '@ngu/carousel';

const LISTING: Listing = {
  user_id:     "1",
  category:    "baby & kids",  // TODO: Decide if UI does the name conversion or the API
  condition:   "good",  // TODO: Decide if UI does the name conversion or the API
  title:       "Cool Thing Wanted But Description Is Way Too Long",
  description: "Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor", // sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  keywords:    "keyword, keyword, keyword, keyword",
  linkUrl:     "https://mmm.somewebsite.com/an/example/of/what/i/want",
  price:       "100",
  zipcode:     "99999", // TODO: SHOULD THIS BE LOCATION???
  status:      "10",
  images:      ["http://ecx.images-amazon.com/images/I/51EOogsHt6L.jpg",
                "http://ecx.images-amazon.com/images/I/41W4p0WkW1L.jpg",
                "http://img.wolverineworldwide.com/is/image/WolverineWorldWide/PG49049_1_1200x735?$dw-large$"
                ],
  imagesRef:   "12",
  slug:        "13",
  createdAt:   "14",
  updatedAt:   "15"
};


@Component({
  moduleId: module.id,
  selector: 'listing-page',
  templateUrl: 'listing-page.component.html',
  styleUrls: ['listing-page.component.css']
})
export class ListingPageComponent implements OnInit {
  @Input() listing: Listing = LISTING;
  @Input() isNewListing: Boolean = false;
  public carouselConfig: NguCarousel;
  showMessageBox: Boolean = true;    // MAKE THIS TOGGLED PER THE MESSAGES ICON

  constructor(private icons:   IconService,
              private helpers: HelpersService) {

  }

  ngOnInit() {
    this.carouselConfig = {
      grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
      slide: 1,
      speed: 400,
      // interval: 4000,
      point: {
        visible: true
      },
      load: 2,
      touch: true,
      loop: true,
      custom: 'banner'
    }
  }

  carouselLoaded(event: Event) {
    console.log("Carousel has loaded: ", event);
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
}
