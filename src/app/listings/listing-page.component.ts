import { Component, OnInit, OnDestroy } from '@angular/core';
// import { AuthService, UserAuth }        from '../core/auth/auth.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription }           from 'rxjs';
import { ApiListingsService }     from '../core/api/api-listings.service';
import { Listing } from './listing.model';

// const LISTING: Listing = {
//   id:          "1",
//   userId:      "1",
//   category:    "2",  // TODO: Decide if UI does the name conversion or the API
//   condition:   "2",  // TODO: Decide if UI does the name conversion or the API
//   title:       "Cool Thing Wanted But Description Is Way Too Long",
//   description: "Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor", // sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//   keywords:    "keyword, keyword, keyword, keyword",
//   linkUrl:     "https://www.etsy.com/listing/536967730/fox-baby-booties-baby-shoes-cotton-baby?ref=shop_home_active_48",
//   price:       "100",
//   location:    "99999", // TODO: SHOULD THIS BE LOCATION???
//   status:      "10",
//   heroImage:   "http://ecx.images-amazon.com/images/I/51EOogsHt6L.jpg",
//   images:      ["http://ecx.images-amazon.com/images/I/51EOogsHt6L.jpg",
//                 "http://ecx.images-amazon.com/images/I/41W4p0WkW1L.jpg",
//                 "http://img.wolverineworldwide.com/is/image/WolverineWorldWide/PG49049_1_1200x735?$dw-large$"
//                 ],
//   imagesRef:   "12",
//   slug:        "13",
//   createdAt:   "14",
//   updatedAt:   "15"
// };


@Component({
  moduleId: module.id,
  selector: 'listing-page',
  templateUrl: 'listing-page.component.html',
  styleUrls: ['listing-page.component.css']
})
export class ListingPageComponent implements OnInit, OnDestroy{
  isEditing:Boolean = false;  // TODO: WE NEED AN EVENT LISTENER FOR CHANGING THIS ONE FROM BELOW
  listing: Listing;
  pageSubscription: Subscription;


  constructor(
    // private authService:     AuthService,
               private route:           ActivatedRoute,
               private listingsApi:     ApiListingsService) {
  }

  ngOnInit() {
    const that = this;
    this.pageSubscription = this.route.params.subscribe( (params: Params) => {
      const listingId = params['listingId'];
      console.log("TRIGGERED SUBSCRIPTION THAT WATCHES PARAMS: ", params);
      that.getListing(listingId);
    });
  }

  ngOnDestroy() {
    this.pageSubscription.unsubscribe();
  }

  getListing(listingId) {
    const that = this;
    this.listingsApi
      .getListing(listingId)
      .subscribe(
        listing => {
          console.log("LISTING RETRIEVED: ", listing);
          that.listing = listing;
        },
        error => {
          console.log("ERROR GETTING LISTING: ", error);
        });
  }

  // This toggles into edit mode via the full-listing icon
  toggleEditing(input: any = null): void {
    console.log("In Listing Page. isEditing will now be: ", this.isEditing);
    if(typeof(input) === 'boolean') { this.isEditing = input; }
    else { this.isEditing = !this.isEditing; }
    console.log("isEditing IS NOW: ", this.isEditing);
    this.scrollToEdit();   // Scroll so the edit is in view
  }

  private scrollToEdit() {
    if(this.isEditing) {
      setTimeout( () => {
        const editEl = document.getElementById('listing-edit-container');
        console.log("ELEMENT TO SCROLL TO IS: ", editEl);
        editEl.scrollIntoView({behavior: 'smooth'});
      }, 200);
    }
  }
}
