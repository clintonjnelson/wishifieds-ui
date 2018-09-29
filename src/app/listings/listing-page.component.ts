import { Component, OnInit } from '@angular/core';
// import { Router }          from '@angular/router';
import { Listing } from './listing.model';

const LISTING: Listing = {
  id:          "1",
  userId:      "1",
  category:    "2",  // TODO: Decide if UI does the name conversion or the API
  condition:   "2",  // TODO: Decide if UI does the name conversion or the API
  title:       "Cool Thing Wanted But Description Is Way Too Long",
  description: "Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor", // sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  keywords:    "keyword, keyword, keyword, keyword",
  linkUrl:     "https://www.etsy.com/listing/536967730/fox-baby-booties-baby-shoes-cotton-baby?ref=shop_home_active_48",
  price:       "100",
  location:    "99999", // TODO: SHOULD THIS BE LOCATION???
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
  isEditing:Boolean = false;  // TODO: WE NEED AN EVENT LISTENER FOR CHANGING THIS ONE FROM BELOW
  listing: Listing;

  constructor() {

  }

  ngOnInit() {
    this.listing = LISTING;
  }

  // This toggles into edit mode via the full-listing icon
  toggleEditing(input: any = null): void {
    if(typeof(input) === 'boolean') { this.isEditing = input; }
    else { this.isEditing = !this.isEditing; }
    console.log("isEditing IS NOW: ", this.isEditing);
    this.scrollToEdit();   // Scroll so the edit is in view
  }

  private scrollToEdit() {
    setTimeout( () => {
      const editEl = document.getElementById('listing-edit-container');
      console.log("ELEMENT TO SCROLL TO IS: ", editEl);
      editEl.scrollIntoView({behavior: 'smooth'});
    }, 300);
  }
}
