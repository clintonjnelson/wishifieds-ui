import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material';
import { HelpersService }  from '../shared/helpers/helpers.service';
import { IconService }     from '../core/services/icon.service';
import { AuthService }     from '../core/auth/auth.service';
// import { GAEventService }  from '../../core/services/ga-event.service';
import { Listing }            from './listing.model';


const NEW_LISTING: Listing = {
  id:             undefined,
  userId:         "-1", // Fill this in with the requesting user information
  ownerUsername:  "",
  ownerPicUrl:    "",
  title:          "",
  description:    "",
  linkUrl:        "",
  price:          "",
  status:         "",
  hero:           "",
  images:         [],
  tags:           [],
  slug:           "",
  location:       undefined,
  createdAt:      "",
  updatedAt:      ""
};


@Component({
  moduleId: module.id,
  selector: 'add-listing',
  templateUrl: 'add-listing.component.html',
  styleUrls:  ['add-listing.component.css']
})

// TODO: NEED AN EDIT FORM. PROBABLY SEPARATE FOR FROM THE CARD. TRY TO COME UP WITH ONE
// BUT for RE listings, maybe we do need different types...
// RE would show a map & outline of the area interested in
// Normal listings are just a picture
// Maybe other types as well??

export class AddListingComponent implements OnInit{
  newListing = NEW_LISTING;
  @Input() isEditing = false;
  @Output() saveEE = new EventEmitter<any>();
  @Output() destroyEE = new EventEmitter<any>();

  constructor(private helpers: HelpersService,
              private icons: IconService,
              private authService: AuthService) {
  }
              // private gaEvent: GAEventService

  ngOnInit() {
    this.newListing['userId'] = this.authService.auth.userId;
  }

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  // Functions for Bubbling Up
  destroy(event: any) {
    console.log("IN ADD-LISTING DESTROY FUNCTION; EVENT IS ", event);
    this.toggleIsEditing(false);
  }

  save(event: any) {
    let newListing = event;
    console.log("LISTING AT THE ADDLISTING LEVEL IS: ", newListing);
    // Reset the area to closed. Triggered by event emitters from inner save/close
    this.closeForms();

    // Format the linkUrl as needed:
    newListing.linkUrl = this.helpers.verifyOrAddProtocolToUrl(newListing.linkUrl);
    console.log("VERIFY URL FORMATTING OCCURED: ", newListing.linkUrl);

    this.saveEE.emit(newListing);    // keep passing the sign up
  }

  toggleIsEditing(input: any = null):void {
    // If setting value directly, do that. Else, just toggle the value
    if(typeof(input) === 'boolean') { this.isEditing = input; }
    else { this.isEditing = !this.isEditing; }
  }

  // Toggle Control Functions
  private closeForms() {
    this.toggleIsEditing(false);
  }
}

