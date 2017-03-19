import { Component } from '@angular/core';
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

export class SearchBoxComponent {
  searchStr: string;
  foundUsers: User[];     // users found by search
  foundSigns: Sign[];     // signs found by search
  hasSearched: boolean = false;    // dont show "0 results" before a search

  constructor(private apiSearchService: ApiSearchService,
              private signpostApi:      SignpostApi,
              private authService:      AuthService) {} // auth used when admin extends Component

  search(event: any) {
    event.preventDefault();
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
  }
}
