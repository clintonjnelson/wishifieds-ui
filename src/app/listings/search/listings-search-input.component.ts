import { Component, OnInit } from '@angular/core';
import { ActivatedRoute }    from '@angular/router';
import { AuthService }       from '../../core/auth/auth.service';
import { AbstractSearchInputComponent } from '../../shared/search-input/search-input.component'
// import { ApiSearchService }  from '../core/api/api-search.service';
// import { GAEventService }    from '../core/services/ga-event.service';


@Component({
  moduleId: module.id,
  selector: 'listings-search-input',
  templateUrl: '../../shared/search-input/search-input.component.html',
  styleUrls:  ['../../shared/search-input/search-input.component.css']
})

// Abstract Class meant to be used to create new search inputs
// This is abstract because you will need to call the API endpoint for appropricate resource to search.
export class ListingsSearchInputComponent extends AbstractSearchInputComponent implements OnInit {

  apiSearch(searchStr, callback) {
    console.log("MADE IT TO SEARCH, JUST NEED TO CALL A REAL API.")
    // callback(this.apiSearchService.search(this.searchStr))
  }
}
