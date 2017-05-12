import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../users/user.model';
import { Sign } from '../../signs/sign.model';
import { AuthService } from '../../core/auth/auth.service';
import { SignpostApi } from '../../core/api/signpost-api.service';
import { ApiSearchService } from '../../core/api/api-search.service';


@Component({
  moduleId: module.id,
  selector: 'search-box',
  templateUrl: 'search-box.component.html',
  styleUrls:  ['search-box.component.css']
})

export class SearchBoxComponent implements OnInit {
  searchStr: string;
  foundUsers: User[];     // users found by search
  foundSigns: Sign[];     // signs found by search
  hasSearched = false;    // dont show "0 results" before a search

  constructor(private   apiSearchService: ApiSearchService,
              private   signpostApi:      SignpostApi,
              protected authService:      AuthService,
              private   route:            ActivatedRoute) {} // auth used when admin extends Component

  ngOnInit() {
    // Set searchQuery to our search, if exists (user clicked 'back'), or set empty
    this.searchStr = this.route.snapshot.queryParams['searchQuery'] || '';
    if(this.searchStr) { this.search(null); }
                         // .queryParams
                         // .map(params => params['searchQuery'] || '');
                         // MAY NEED THIS IF GOING BACK WON"T RE-HIT NG-INIT
                         // IF USE THIS, WILL ALSO NEED TO DESTROY THE SUBSCRIPTION WATCH WITH METHOD CALL
  }

  search(event: any) {
    if(event) { event.preventDefault(); }  // if get here with form submit
    if(this.searchStr && history.pushState) { updateExistingUrl(this.searchStr); }
    const that = this;
    console.log("SEARCHING CLICKED!");
    console.log("Search string is: ", this.searchStr);

    this.apiSearchService.search(that.searchStr)
      .subscribe(
        searchResults => {
          console.log("SEARCH RESULTS FOUND ARE: ", searchResults);
          that.foundSigns  = searchResults.signs;
          that.foundUsers  = searchResults.users;
          that.hasSearched = true;
        },
        error => {
          console.log("SEARCH ERROR RETURNED: ", error);
        });

    function updateExistingUrl(searchStr: string) {
      const updatedSearchUrl = window.location.protocol + '//' +  // https://
                               window.location.host +             // www.syynpost.com
                               window.location.pathname +         // /
                               '?searchQuery=' + searchStr;  // ?searchQuery=Superman
      // Update the existing history
      window.history.pushState({path: updatedSearchUrl}, '', updatedSearchUrl);
    }
  }
}
