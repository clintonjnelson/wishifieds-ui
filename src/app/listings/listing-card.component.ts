import { Component, ViewChild  } from '@angular/core';
import { IconService } from '../core/services/icon.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { HelpersService } from '../shared/helpers/helpers.service';
import { DragScrollDirective } from 'ngx-drag-scroll';


export class Listing {
  user_id:     String;
  categoryId:  String;
  conditionId: String;
  title:       String;
  description: String;
  keywords:    String;
  linkUrl:     String;
  price:       String;
  zipcode:     String;
  status:      String;
  images:      String[];
  imagesRef:   String;
  slug:        String;
  createdAt:   String;
  updatedAt:   String;
}



const A_LISTING: Listing = {
  user_id:     "1",
  category:    "2",  // TODO: Decide if UI does the name conversion or the API
  condition:   "good",  // TODO: Decide if UI does the name conversion or the API
  title:       "Cool Thing Wanted But Description Is Way Too Long",
  description: "Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor", // sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  keywords:    "keyword, keyword, keyword, keyword",
  linkUrl:     "https://mmm.somewebsite.com/an/example/of/what/i/want",
  price:       "100",
  zipcode:     "99999",
  status:      "10",
  images:      ["http://ecx.images-amazon.com/images/I/41W4p0WkW1L.jpg",
                "http://ecx.images-amazon.com/images/I/51EOogsHt6L.jpg",
                "http://img.wolverineworldwide.com/is/image/WolverineWorldWide/PG49049_1_1200x735?$dw-large$"
                ],
  imagesRef:   "12",
  slug:        "13",
  createdAt:   "14",
  updatedAt:   "15"
}







@Component({
  moduleId: module.id,
  selector: 'listing-card',
  templateUrl: 'listing-card.component.html',
  styleUrls: ['listing-card.component.css']
})

export class ListingCardComponent {
  @ViewChild('nav', {read: DragScrollDirective}) ds: DragScrollDirective;
  listing: Listing = A_LISTING;
  expandedInfo = false;

  constructor( private icons: IconService,
               private helpers: HelpersService) {
  }

  moveLeft() {
    this.ds.moveLeft();
  }
  moveRight() {
    this.ds.moveRight();
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







