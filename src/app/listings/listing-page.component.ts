import { Component, OnInit, OnDestroy } from '@angular/core';
// import { AuthService, UserAuth }        from '../core/auth/auth.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription, Subject }  from 'rxjs';
import { ApiListingsService }     from '../core/api/api-listings.service';
import { Listing } from './listing.model';



@Component({
  moduleId: module.id,
  selector: 'listing-page',
  templateUrl: 'listing-page.component.html',
  styleUrls: ['listing-page.component.css']
})
export class ListingPageComponent implements OnInit, OnDestroy{
  isEditing:Boolean = false;  // TODO: WE NEED AN EVENT LISTENER FOR CHANGING THIS ONE FROM BELOW
  listing: Listing;
  listingSub: Subscription;
  listingEmit: Subject<Listing> = new Subject<Listing>();
  pageSub: Subscription;


  constructor(
    // private authService:     AuthService,
    private route:           ActivatedRoute,
    private listingsApi:     ApiListingsService) {
  }

  ngOnInit() {
    const that = this;
    this.pageSub = this.route.params.subscribe( (params: Params) => {
      const listingId = params['listingId'];
      console.log("TRIGGERED SUBSCRIPTION THAT WATCHES PARAMS: ", params);
      that.getListing(listingId);
    });
    this.listingSub = this.listingEmit.subscribe( (newListing: Listing) => {
      console.log("Listing will be updated in listing page per saved values: ", newListing);
      // TODO: ALTERNATIVELY MAKE REQUEST TO API TO ENSURE LATEST VERSION???
      that.listing = newListing;
    })
  }

  ngOnDestroy() {
    this.listingSub.unsubscribe();
    this.pageSub.unsubscribe();
  }

  getListing(listingId) {
    const that = this;
    this.listingsApi
      .getListing(listingId)
      .subscribe(
        listing => {
          console.log("LISTING RETRIEVED: ", listing);
          that.listingEmit.next(listing);
        },
        error => {
          console.log("ERROR GETTING LISTING: ", error);
        });
  }

  // This toggles into edit mode via the full-listing icon
  toggleEditing(input: any = null): void {
    console.log("In Listing Page. isEditing will now be: ", input);
    if(typeof(input) === 'boolean') { this.isEditing = input; }
    else { this.isEditing = !this.isEditing; }
    console.log("isEditing IS NOW: ", this.isEditing);
    this.scrollToEdit();   // Scroll so the edit is in view
  }

  save(listing: any = null): void {
    // FIXME: Current does not pass info down for updating; Simple hardcoded to close editing
    this.toggleEditing(false);
    this.listingEmit.next(listing);
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
