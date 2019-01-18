import { Component, OnInit } from '@angular/core';
import { ActivatedRoute }    from '@angular/router';
import { AuthService }       from '../../core/auth/auth.service';
import { ApiSearchService }  from '../../core/api/api-search.service';
import { Listing }           from '../listing.model';

@Component({
  moduleId: module.id,
  selector: 'listings-search',
  templateUrl: 'listings-search.component.html',
  styleUrls:  ['listings-search.component.css']
})

export class ListingsSearchComponent implements OnInit {
  searchStr: string;
  listings: Listing[];    // Allow variable search type
  hasSearched = false;  // dont show "0 results" before a search

  constructor(
              private   apiSearchService: ApiSearchService,
              protected authService:      AuthService,
              private   route:            ActivatedRoute,
              // private   gaEvent:          GAEventService
              ) {}

  ngOnInit() {
    console.log("MADE IT TO SEARCH INPUT COMPONENT!");
    // Set searchQuery to our search, if exists (user clicked 'back'), or set empty
    this.searchStr = this.route.snapshot.queryParams['search'] || '';
    if(this.searchStr) { this.search(null); }
                           // .queryParams
                           // .map(params => params['searchQuery'] || '');
                           // MAY NEED THIS IF GOING BACK WON"T RE-HIT NG-INIT
                           // IF USE THIS, WILL ALSO NEED TO DESTROY THE SUBSCRIPTION WATCH WITH METHOD CALL
  }

  search(event: any) {
    if(event) { event.preventDefault(); }  // if get here with form submit
    if(this.searchStr && history.pushState) { this.updateExistingUrl(this.searchStr); }
    const that = this;
    console.log("SEARCHING CLICKED!");
    console.log("Search string is: ", this.searchStr);

    this.apiSearchService.searchListings(that.searchStr)
      .subscribe(
        results => {
          console.log("SEARCH RESULTS FOUND ARE: ", results);
          that.listings  = results;
          that.hasSearched = true;
        },
        error => {
          console.log("SEARCH ERROR RETURNED: ", error);
        });
    // this.gaClick('searchsubmit');
  }

  // TODO: ? Maybe break this out into a shared method in Helpers or a Utils file
  // Updates history of current page, so can come back to with window.history.back();
  private updateExistingUrl(searchStr: string) {
    const updatedSearchUrl = window.location.protocol + '//' +  // https://
                             window.location.host +             // www.syynpost.com
                             window.location.pathname +         // /
                             '?search=' + searchStr;  // ?searchQuery=Superman
    // Update the existing history for page (don't pushState, replaceState)
    window.history.replaceState({path: updatedSearchUrl}, '', updatedSearchUrl);
  }
}
