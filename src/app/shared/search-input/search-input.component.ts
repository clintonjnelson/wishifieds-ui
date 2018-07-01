import { Component, OnInit } from '@angular/core';
import { ActivatedRoute }    from '@angular/router';
import { AuthService }       from '../../core/auth/auth.service';
// import { ApiSearchService }  from '../core/api/api-search.service';
// import { GAEventService }    from '../core/services/ga-event.service';


@Component({
  moduleId: module.id,
  selector: 'search-input',
  templateUrl: 'search-input.component.html',
  styleUrls:  ['search-input.component.css']
})


// Abstract Class meant to be used to create new search inputs
// This is abstract because you will need to call the API endpoint for appropricate resource to search.
export abstract class AbstractSearchInputComponent implements OnInit {
  searchStr: string;
  foundItems: any[];    // Allow variable search type
  hasSearched = false;  // dont show "0 results" before a search

  constructor(
              // private   apiSearchService: ApiSearchService,
              // private   signpostApi:      SignpostApi,
              protected authService:      AuthService,
              private   route:            ActivatedRoute,
              // private   gaEvent:          GAEventService
              ) {} // auth used when admin extends Component

  ngOnInit() {
    console.log("MADE IT TO SEARCH INPUT COMPONENT!");
    // Set searchQuery to our search, if exists (user clicked 'back'), or set empty
    this.searchStr = this.route.snapshot.queryParams['searchQuery'] || '';
    if(this.searchStr) { this.search(null); }
                         // .queryParams
                         // .map(params => params['searchQuery'] || '');
                         // MAY NEED THIS IF GOING BACK WON"T RE-HIT NG-INIT
                         // IF USE THIS, WILL ALSO NEED TO DESTROY THE SUBSCRIPTION WATCH WITH METHOD CALL
  }

  // gaClick(label: string) {
  //   this.gaEvent.emitEvent('search', 'click', label);
  // }

  search(event: any) {
    // this.gaClick('searchsubmit');

    if(event) { event.preventDefault(); }  // if get here with form submit
    if(this.searchStr && history.pushState) { this.updateExistingUrl(this.searchStr); }
    const that = this;
    console.log("SEARCHING CLICKED!");
    console.log("Search string is: ", this.searchStr);

    this.apiSearch(this.searchStr, function(searchResults) {
       // This callback should be used in the abstract method to pass the searchResults
       searchResults.subscribe(
         results => {
           console.log("Search results found are: ", results);
           that.foundItems = results;  // TODO: MAY NEED TO REFERENCE A FIELD LIKE .results
         },
         error => {
           console.log("Search error returned: ", error);
         });
    });

    // this.apiSearchService.search(that.searchStr)
    //   .subscribe(
    //     searchResults => {
    //       console.log("SEARCH RESULTS FOUND ARE: ", searchResults);
    //       that.foundItems  = searchResults.signs;
    //       that.hasSearched = true;
    //     },
    //     error => {
    //       console.log("SEARCH ERROR RETURNED: ", error);
    //     });

    // function updateExistingUrl(searchStr: string) {
    //   const updatedSearchUrl = window.location.protocol + '//' +  // https://
    //                            window.location.host +             // www.syynpost.com
    //                            window.location.pathname +         // /
    //                            '?searchQuery=' + searchStr;  // ?searchQuery=Superman
    //   // Update the existing history
    //   window.history.pushState({path: updatedSearchUrl}, '', updatedSearchUrl);
    // }
  }

  abstract apiSearch(searchStr, callback)
    // Something like: callback(this.apiSearchService.search(that.searchStr))

  private updateExistingUrl(searchStr: string) {
    const updatedSearchUrl = window.location.protocol + '//' +  // https://
                             window.location.host +             // www.syynpost.com
                             window.location.pathname +         // /
                             '?searchQuery=' + searchStr;  // ?searchQuery=Superman
    // Update the existing history
    window.history.pushState({path: updatedSearchUrl}, '', updatedSearchUrl);
  }
}
