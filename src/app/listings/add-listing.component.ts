import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTooltipModule } from '@angular/material';
import { HelpersService }  from '../shared/helpers/helpers.service';
import { IconService }     from '../core/services/icon.service';
// import { GAEventService }  from '../../core/services/ga-event.service';
import { Listing }            from './listing.model';

export class Category{

}


@Component({
  moduleId: module.id,
  selector: 'add-listing',
  templateUrl: 'add-listing.component.html',
  styleUrls:  ['add-listing.component.css']
})

// TODO: NEED AN EDIT FORM. PROBABLY SEPARATE FOR FROM THE CARD. TRY TO COME UP WITH ONE
// GENERIC ENOUGH TO BE USED FOR ALL TYPES OF CATEGORIES.
// BUT for RE listings, maybe we do need different types...
// RE would show a map & outline of the area interested in
// Normal listings are just a picture
// Maybe other types as well??

export class AddListingComponent {
  categories: Category[];
  selectedCategory: Category;
  showAddCategoryIcons = false;
  showForm = false;
  @Input()  listings: Listing[];
  @Output() saveEE  = new EventEmitter<any>();
  @Output() destroyEE = new EventEmitter<any>();
  // MAYBE: TO ENABLE DYNAMIC SIGN TYPE UPDATE, LISTEN VIA NEW @OUTPUT FOR CHANGES,
  // WOULD PROBABLY HAVE TO BE SENT UPON EACH KEYSTROKE OR SOMETHING LIKE THAT.
  // THEN CAPTURE DATA & SEND BACK THE TYPE-CHANGED SIGN WITH USER'S FORM DATA
  // UDPATED IN THIS SIGN. THEN WONT HAVE TO TURN OFF TYPES AFTER SELECTION.
  // WOULD HAVE ONE SELECTED_SIGN THAT GETS UPDATES WITH ONLY TYPE & COLOR & ICON
  // WHEN ANOTHER TYPE IS CHANGED.

  // This builds the partial-filled out non-selectable form attributes
  // buildListings(signAddTypes: SignAddType[] ): Sign[] {
  //   return signAddTypes.map(function(sign) {
  //     return { icon:        sign.icon,
  //              bgColor:     sign.bgColor,
  //              signName:    sign.signName,
  //              signType:    sign.signType,
  //              _id:         '',
  //              description: '',
  //              knownAs:     '',
  //              linkUrl:     '',
  //              picUrl:      '',
  //              userId:      '',
  //            };
  //   });
  // }

  constructor(private helpers: HelpersService,
              private icons:   IconService) {}
              // private gaEvent: GAEventService

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  // Set the sign to create RENAME: SET_CREATE_SIGN, SELECTED_CREATE_SIGN
  // I THINK THIS SHOULD BE SETCATEGORY, but i also don't think we need that... yet.

  setCategory(category: Category) {
    this.selectedCategory = category;
    this.toggleShowAddCategoryIcons(false);
    // this.gaClick('addcustomsign', sign.icon);
    console.log("SETTING CATEGORY TO: ", category);
  }

  // Functions for Bubbling Up
  destroy(event: any) {
    console.log("IN ADD-LISTING DESTROY FUNCTION; EVENT IS ", event);
    this.toggleShowForm(false);
  }
  save(event: any) {
    let newListing = event;
    if(!event._id) { newListing._id = this.listings.length; }  // ?????????? WHAT IS THIS DOING?
    console.log("LISTING AT THE ADDLISTING LEVEL IS: ", newListing);
    // Reset the area to closed. Triggered by event emitters from inner save/close
    this.closeForms();

    // Format the linkUrl as needed:
    newListing.linkUrl = this.helpers.verifyOrAddProtocolToUrl(newListing.linkUrl);
    console.log("VERIFY URL FORMATTING OCCURED: ", newListing.linkUrl);

    this.saveEE.emit(newListing);    // keep passing the sign up
  }

  toggleShowAddCategoryIcons(input: any = null): void {
    // If setting value directly, do that. Else, just toggle the value
    if(typeof(input) === 'boolean') { this.showAddCategoryIcons = input; }
    else { this.showAddCategoryIcons = !this.showAddCategoryIcons; }
  }
  toggleShowForm(input: any = null):void {
    // If setting value directly, do that. Else, just toggle the value
    if(typeof(input) === 'boolean') { this.showForm = input; }
    else { this.showForm = !this.showForm; }
  }

  // gaClick(category: string, label: string) {
  //   this.gaEvent.emitEvent(category, 'click', label);
  // }

  // Toggle Control Functions
  private closeForms() {
    this.toggleShowAddCategoryIcons(false);
    this.toggleShowForm(false);
  }
}

