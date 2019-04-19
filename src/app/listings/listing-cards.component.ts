import { Component, Input, ViewChild, OnInit, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { Router }          from '@angular/router';
import { IconService }     from '../core/services/icon.service';
import { ApiUsersService } from '../core/api/api-users.service';
import { Listing }         from './listing.model';


// Probably swap this out with a dynamic icon map that also has a local backup hardcoded
const CATEGORY_LIST = {
  '1'  :                { id: 1, icon: 'star', name: 'antiques' },
  '2'  :                     { id: 2, icon: 'star', name: 'art' },
  '3'  :          { id: 3, icon: 'star', name: 'atv & off-road' },
  '4'  :               { id: 4, icon: 'star', name: 'autoparts' },
  '5'  :                   { id: 5, icon: 'star', name: 'autos' },
  '6'  :             { id: 6, icon: 'star', name: 'baby & kids' },
  '7'  :        { id: 7, icon: 'star', name: 'bicycles & parts' },
  '8'  :      { id: 8, icon: 'star', name: 'boats & watercraft' },
  '9'  :       { id: 9, icon: 'star', name: 'books & magazines' },
  '10':          { id: 10, icon: 'star', name: 'camera & video' },
  '11':  { id: 11, icon: 'star', name: 'clothing & assessories' },
  '12':            { id: 12, icon: 'star', name: 'collectibles' },
  '13':               { id: 13, icon: 'star', name: 'computers' },
  '14':             { id: 14, icon: 'star', name: 'electronics' },
  '15':      { id: 15, icon: 'star', name: 'farm & agriculture' },
  '16':               { id: 16, icon: 'star', name: 'furniture' },
  '17':            { id: 17, icon: 'star', name: 'games & toys' },
  '18':                    { id: 18, icon: 'star', name: 'gigs' },
  '19':         { id: 19, icon: 'star', name: 'health & beauty' },
  '20':              { id: 20, icon: 'star', name: 'housewares' },
  '21':    { id: 21, icon: 'star', name: 'housing & apartments' },
  '22':                { id: 22, icon: 'star', name: 'jewelery' },
  '23':           { id: 23, icon: 'star', name: 'lawn & garden' },
  '24':               { id: 24, icon: 'star', name: 'materials' },
  '25':  { id: 25, icon: 'star', name: 'motorcycles & scooters' },
  '26':           { id: 26, icon: 'star', name: 'musical goods' },
  '27':                   { id: 27, icon: 'star', name: 'other' },
  '28':             { id: 28, icon: 'star', name: 'real estate' },
  '29':                 { id: 29, icon: 'star', name: 'rentals' },
  '30':   { id: 30, icon: 'star', name: 'services & consulting' },
  '31':          { id: 31, icon: 'star', name: 'sporting goods' },
  '32':        { id: 32, icon: 'star', name: 'tickets & events' },
  '33':       { id: 33, icon: 'star', name: 'tools & equipment' },
  '34': { id: 34, icon: 'star', name:'travel & accommodations'  }
};




@Component({
  moduleId: module.id,
  selector: 'listing-cards',
  templateUrl: 'listing-cards.component.html',
  styleUrls: ['listing-cards.component.css']
})
export class ListingCardsComponent implements OnInit, OnChanges {
  // Options Area flags should come in as @Input() also.
  @Input() listings: Listing[];
  filteredListings: Listing[];
  filters: Object;        // Object of icon names {name: Boolean} false=show true=hide
  filterIcons: string[];  // Selected filters
  filtersCount:  number;  // Used to trigger search results reset


  constructor(private icons:           IconService,
              private apiUsersService: ApiUsersService,
              private router:          Router) {}
              // private gaEvent:         GAEventService) {}  TODO: GOOGLE ANALYTICS

  ngOnInit() {
    this.resetFilters();
    console.log("Filters init is: ", this.filters);
    console.log("Filtered Listings init is: ", this.filteredListings);
    console.log("FilterIcons at init is: ", this.filterIcons);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.listings = changes.listings.currentValue;
    this.resetFilters();
  }

  filter(icon: string) {
    // this.gaEvent.emitEvent('searchresultsfilter', 'click', filterIcon.icon);
    this.toggleFilterByIcon(icon);
    this.updateDisplayedResults();  // update displayed results
    console.log("Filters final is: ", this.filters);
    console.log("Filtered Listings after update is: ", this.filteredListings);
  }

  // TODO: GOOGLE ANALYTICS TRACKING
  // gaClick(label: string) {
  //   this.gaEvent.emitEvent('searchresults', 'click', label);
  // }


  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  // *********** HELPERS *************
  private generateFiltersAndIcons() {
    const that = this;
    // this.listings.forEach((listing) => {
    //   // If already added, break. Else add to filters & displayIcons
    //   var icon = CATEGORY_LIST[listing.category]['icon'];
    //   if(that.filters[icon] !== undefined) { return; }  // VERIFY THAT THIS SHOULDN"T BE SEARCHING FILTERICONS
    //   else {
    //     that.filters[icon] = false;   // addToFilters(icon);
    //     that.filterIcons.push(icon);  // addDisplayIcon(icon); TODO: TRY TO GET RID OF THIS ARRAY!!!!!!! USE JUST THE FILTERS ARRAY.
    //   }
    // });
  }

  private toggleFilterByIcon(icon: string) {
    this.filters[icon] = !this.filters[icon];
    // THIS LINE SHOULD BE TESTED, AS AN EDGE CASE COULD CAUSE ISSUE....
    console.log("Filter count before is: ", this.filtersCount);
    this.filters[icon] ? this.filtersCount++ : this.filtersCount--;  // adjust count
    console.log("Filter count after is: ", this.filtersCount);
  }

  private updateDisplayedResults() {
    if(this.filtersCount === 0) {
      this.resetListings();
    }
    else {
      const that = this;
      // If compare sign icon to filter list to see if allow or not
      this.filteredListings = this.listings.filter((listing) => {
        var icon = CATEGORY_LIST[listing.categoryId]['icon'];
        return that.filters[icon];  // true will keep
      });
    }
  }

  private resetFilters() {
    this.filters      = {};
    this.filterIcons  = [];
    this.filtersCount = 0;
    this.generateFiltersAndIcons();
    this.resetListings();
  }

  private resetListings() {
    if(this.listings) {
      this.filteredListings = this.listings.slice();
    }  // Copy orig array to reset the display array
  }
}
