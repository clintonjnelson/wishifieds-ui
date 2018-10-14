import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router }          from '@angular/router';
import { IconService }    from '../../core/services/icon.service';
import { ApiUsersService } from '../../core/api/api-users.service';
import { Listing }         from '../listing.model';


// Probably swap this out with a dynamic icon map that also has a local backup hardcoded
const CATEGORY_LIST = {
  'antiques':                { icon: 'star' },
  'art':                     { icon: 'star' },
  'atv & off-road':          { icon: 'star' },
  'autoparts':               { icon: 'star' },
  'autos':                   { icon: 'star' },
  'baby & kids':             { icon: 'star' },
  'bicycles & parts':        { icon: 'star' },
  'boats & watercraft':      { icon: 'star' },
  'books & magazines':       { icon: 'star' },
  'camera & video':          { icon: 'star' },
  'clothing & assessories':  { icon: 'star' },
  'collectibles':            { icon: 'star' },
  'computers':               { icon: 'star' },
  'electronics':             { icon: 'star' },
  'farm & agriculture':      { icon: 'star' },
  'furniture':               { icon: 'star' },
  'games & toys':            { icon: 'star' },
  'gigs':                    { icon: 'star' },
  'health & beauty':         { icon: 'star' },
  'housewares':              { icon: 'star' },
  'housing & apartments':    { icon: 'star' },
  'jewelery':                { icon: 'star' },
  'lawn & garden':           { icon: 'star' },
  'materials':               { icon: 'star' },
  'motorcycles & scooters':  { icon: 'star' },
  'musical goods':           { icon: 'star' },
  'other':                   { icon: 'star' },
  'real estate':             { icon: 'star' },
  'rentals':                 { icon: 'star' },
  'services & consulting':   { icon: 'star' },
  'sporting goods':          { icon: 'star' },
  'tickets & events':        { icon: 'star' },
  'tools & equipment':       { icon: 'star' },
  'travel & accommodations': { icon: 'star' }
};




@Component({
  moduleId: module.id,
  selector: 'listings-search-results',
  templateUrl: 'listings-search-results.component.html',
  styleUrls: ['listings-search-results.component.css']
})
export class ListingsSearchResultsComponent implements OnInit, OnChanges {
  @Input() listings: Listing[] = [];

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
    // this.toggleFilterByIcon(icon);
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

  // TODO: MAY NOT NEED THIS. DEPENDS ON IF WANT THIS FUNCTIONALITY.
  // goToUserPage(userId: string, event: any) {
  //   event.preventDefault();
  //   this.gaClick('userpagelink');
  //   this.apiUsersService.getUsernameByUserId(userId)
  //       .subscribe(
  //         res => {
  //           console.log("RESPONSE FROM GETUSERNAMEBYUSERID IS: ", res);
  //           this.router.navigate(['/', res.username]);
  //         },
  //         error => {

  //         });
  // }

  // *********** HELPERS *************
  private generateFiltersAndIcons() {
    // const that = this;
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
    // this.filters[icon] = !this.filters[icon];
    // // THIS LINE SHOULD BE TESTED, AS AN EDGE CASE COULD CAUSE ISSUE....
    // console.log("Filter count before is: ", this.filtersCount);
    // this.filters[icon] ? this.filtersCount++ : this.filtersCount--;  // adjust count
    // console.log("Filter count after is: ", this.filtersCount);
  }

  private updateDisplayedResults() {
    // if(this.filtersCount === 0) {
    //   this.resetListings();
    // }
    // else {
    //   const that = this;
    //   // If compare sign icon to filter list to see if allow or not
    //   this.filteredListings = this.listings.filter((listing) => {
    //     // var icon = CATEGORY_LIST[listing.category]['icon'];
    //     return that.filters[icon];  // true will keep
    //   });
    // }
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
      this.filteredListings = this.listings.slice();  // Copy orig array to reset the display array
    }
  }
}


// const LISTINGS: Listing[] = [
//   {
//     id:          "1",
//     userId:     "1",
//     category:    "baby & kids",  // TODO: Decide if UI does the name conversion or the API
//     condition:   "good",  // TODO: Decide if UI does the name conversion or the API
//     title:       "Cool Thing Wanted But Description Is Way Too Long",
//     description: "Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor", // sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//     keywords:    "keyword, keyword, keyword, keyword",
//     linkUrl:     "https://mmm.somewebsite.com/an/example/of/what/i/want",
//     price:       "100",
//     location:     "99999",
//     status:      "10",
//     images:      ["http://ecx.images-amazon.com/images/I/51EOogsHt6L.jpg",
//                   "http://ecx.images-amazon.com/images/I/41W4p0WkW1L.jpg",
//                   "http://img.wolverineworldwide.com/is/image/WolverineWorldWide/PG49049_1_1200x735?$dw-large$"
//                   ],
//     imagesRef:   "12",
//     slug:        "13",
//     createdAt:   "14",
//     updatedAt:   "15"
//   },
//   {
//     id:          "1",
//     userId:     "1",
//     category:    "baby & kids",  // TODO: Decide if UI does the name conversion or the API
//     condition:   "good",  // TODO: Decide if UI does the name conversion or the API
//     title:       "Cool Thing Wanted But Description Is Way Too Long",
//     description: "Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor", // sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//     keywords:    "keyword, keyword, keyword, keyword",
//     linkUrl:     "https://mmm.somewebsite.com/an/example/of/what/i/want",
//     price:       "100",
//     location:     "99999",
//     status:      "10",
//     images:      ["http://ecx.images-amazon.com/images/I/41W4p0WkW1L.jpg",
//                   "http://ecx.images-amazon.com/images/I/51EOogsHt6L.jpg",
//                   "http://img.wolverineworldwide.com/is/image/WolverineWorldWide/PG49049_1_1200x735?$dw-large$"
//                   ],
//     imagesRef:   "12",
//     slug:        "13",
//     createdAt:   "14",
//     updatedAt:   "15"
//   },
//   {
//     id:          "1",
//     userId:     "1",
//     category:    "baby & kids",  // TODO: Decide if UI does the name conversion or the API
//     condition:   "good",  // TODO: Decide if UI does the name conversion or the API
//     title:       "Cool Thing Wanted But Description Is Way Too Long",
//     description: "Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor", // sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//     keywords:    "keyword, keyword, keyword, keyword",
//     linkUrl:     "https://mmm.somewebsite.com/an/example/of/what/i/want",
//     price:       "100",
//     location:     "99999",
//     status:      "10",
//     images:      ["http://img.wolverineworldwide.com/is/image/WolverineWorldWide/PG49049_1_1200x735?$dw-large$",
//                   "http://ecx.images-amazon.com/images/I/41W4p0WkW1L.jpg",
//                   "http://ecx.images-amazon.com/images/I/51EOogsHt6L.jpg"
//                   ],
//     imagesRef:   "12",
//     slug:        "13",
//     createdAt:   "14",
//     updatedAt:   "15"
//   },
//   {
//     id:          "1",
//     userId:     "1",
//     category:    "baby & kids",  // TODO: Decide if UI does the name conversion or the API
//     condition:   "good",  // TODO: Decide if UI does the name conversion or the API
//     title:       "Cool Thing Wanted But Description Is Way Too Long",
//     description: "Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor", // sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//     keywords:    "keyword, keyword, keyword, keyword",
//     linkUrl:     "https://mmm.somewebsite.com/an/example/of/what/i/want",
//     price:       "100",
//     location:     "99999",
//     status:      "10",
//     images:      ["http://ecx.images-amazon.com/images/I/51EOogsHt6L.jpg",
//                   "http://ecx.images-amazon.com/images/I/41W4p0WkW1L.jpg",
//                   "http://img.wolverineworldwide.com/is/image/WolverineWorldWide/PG49049_1_1200x735?$dw-large$"
//                   ],
//     imagesRef:   "12",
//     slug:        "13",
//     createdAt:   "14",
//     updatedAt:   "15"
//   },
//   {
//     id:          "1",
//     userId:     "1",
//     category:    "baby & kids",  // TODO: Decide if UI does the name conversion or the API
//     condition:   "good",  // TODO: Decide if UI does the name conversion or the API
//     title:       "Cool Thing Wanted But Description Is Way Too Long",
//     description: "Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor", // sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//     keywords:    "keyword, keyword, keyword, keyword",
//     linkUrl:     "https://mmm.somewebsite.com/an/example/of/what/i/want",
//     price:       "100",
//     location:     "99999",
//     status:      "10",
//     images:      ["http://ecx.images-amazon.com/images/I/41W4p0WkW1L.jpg",
//                   "http://ecx.images-amazon.com/images/I/51EOogsHt6L.jpg",
//                   "http://img.wolverineworldwide.com/is/image/WolverineWorldWide/PG49049_1_1200x735?$dw-large$"
//                   ],
//     imagesRef:   "12",
//     slug:        "13",
//     createdAt:   "14",
//     updatedAt:   "15"
//   },
//   {
//     id:          "1",
//     userId:     "1",
//     category:    "baby & kids",  // TODO: Decide if UI does the name conversion or the API
//     condition:   "good",  // TODO: Decide if UI does the name conversion or the API
//     title:       "Cool Thing Wanted But Description Is Way Too Long",
//     description: "Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor", // sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//     keywords:    "keyword, keyword, keyword, keyword",
//     linkUrl:     "https://mmm.somewebsite.com/an/example/of/what/i/want",
//     price:       "100",
//     location:     "99999",
//     status:      "10",
//     images:      ["http://img.wolverineworldwide.com/is/image/WolverineWorldWide/PG49049_1_1200x735?$dw-large$",
//                   "http://ecx.images-amazon.com/images/I/41W4p0WkW1L.jpg",
//                   "http://ecx.images-amazon.com/images/I/51EOogsHt6L.jpg"
//                   ],
//     imagesRef:   "12",
//     slug:        "13",
//     createdAt:   "14",
//     updatedAt:   "15"
//   },
//   {
//     id:          "1",
//     userId:     "1",
//     category:    "baby & kids",  // TODO: Decide if UI does the name conversion or the API
//     condition:   "good",  // TODO: Decide if UI does the name conversion or the API
//     title:       "Cool Thing Wanted But Description Is Way Too Long",
//     description: "Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor", // sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//     keywords:    "keyword, keyword, keyword, keyword",
//     linkUrl:     "https://mmm.somewebsite.com/an/example/of/what/i/want",
//     price:       "100",
//     location:     "99999",
//     status:      "10",
//     images:      ["http://ecx.images-amazon.com/images/I/41W4p0WkW1L.jpg",
//                   "http://ecx.images-amazon.com/images/I/51EOogsHt6L.jpg",
//                   "http://img.wolverineworldwide.com/is/image/WolverineWorldWide/PG49049_1_1200x735?$dw-large$"
//                   ],
//     imagesRef:   "12",
//     slug:        "13",
//     createdAt:   "14",
//     updatedAt:   "15"
//   },
//   {
//     id:          "1",
//     userId:     "1",
//     category:    "baby & kids",  // TODO: Decide if UI does the name conversion or the API
//     condition:   "good",  // TODO: Decide if UI does the name conversion or the API
//     title:       "Cool Thing Wanted But Description Is Way Too Long",
//     description: "Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor", // sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//     keywords:    "keyword, keyword, keyword, keyword",
//     linkUrl:     "https://mmm.somewebsite.com/an/example/of/what/i/want",
//     price:       "100",
//     location:     "99999",
//     status:      "10",
//     images:      ["http://img.wolverineworldwide.com/is/image/WolverineWorldWide/PG49049_1_1200x735?$dw-large$",
//                   "http://ecx.images-amazon.com/images/I/41W4p0WkW1L.jpg",
//                   "http://ecx.images-amazon.com/images/I/51EOogsHt6L.jpg"
//                   ],
//     imagesRef:   "12",
//     slug:        "13",
//     createdAt:   "14",
//     updatedAt:   "15"
//   }
// ];

