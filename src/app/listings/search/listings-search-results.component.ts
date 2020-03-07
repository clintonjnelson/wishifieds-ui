import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router }          from '@angular/router';
import { IconService }    from '../../core/services/icon.service';
import { ApiUsersService } from '../../core/api/api-users.service';
import { Listing }         from '../listing.model';


@Component({
  moduleId: module.id,
  selector: 'listings-search-results',
  templateUrl: 'listings-search-results.component.html',
  styleUrls: ['listings-search-results.component.css']
})
export class ListingsSearchResultsComponent implements OnInit, OnChanges {
  @Input() listings: Listing[] = [];
  @Input() searchInfo: any;
  @Input() showAnalytics: boolean = false;

  filteredListings: Listing[];
  filters: Object; // Object filter display state by name {mint: false, antiques: false, nintendo: true} false=show true=hide
  filterDisplayIcons: string[];  // Selectable filters for displaying (eg: [mint, antiques, nintendo])
  filtersCount:  number;  // Used to trigger search results reset

  constructor(private icons:           IconService,
              private apiUsersService: ApiUsersService,
              private router:          Router) {}


  ngOnInit() {
    this.resetFilters();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.listings = changes.listings.currentValue;
    this.resetFilters();
  }

  toggleFilter(tagName: string) {
    this.updateFilters(tagName);  // update the filter state object
    this.updateDisplayedResults();  // update displayed results
  }

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }


  // ********************** HELPERS ************************
  private resetFilters() {
    this.filters      = {};
    this.filterDisplayIcons  = [];
    this.filtersCount = 0;
    this.extractFiltersFromListings();
    this.resetListings();
  }

  // This compiles our FULL list of possible filters for display
  private extractFiltersFromListings() {
    const that = this;
    this.listings.forEach((listing) => {
      listing.tags.forEach((tag) => {
        let name = tag.name;
        // If already added, break. Else add to filters & displayIcons
        if(that.filters.hasOwnProperty(name)) { return; }
        else {
          addToFilters(name);
          addDisplayIcon(name);
        }
      });
    });

    function addToFilters(tagName: string) {
      that.filters[tagName] = false;  // Initially add without filtering
    }
    function addDisplayIcon(tagName: string) {
      that.filterDisplayIcons.push(tagName);
    }
  }

  private resetListings() {
    if(this.listings) {
      this.filteredListings = this.listings.slice();  // Copy orig array to reset the display array
      console.log("FILTERED LISTINGS ARE: ", this.filteredListings);
      console.log("FILTERS ARE: ", this.filters);
      console.log("FILTERS COUNT IS: ", this.filtersCount);
      console.log("FILTERS DISPLAY LISTINGS IS: ", this.filtersCount);
    }
  }

  private updateFilters(name: string) {
    console.log("Filters state is before: ", this.filters[name]);
    this.filters[name] = !this.filters[name]; // toggle
    console.log("Filters state is after: ", this.filters[name]);
    console.log("Filter count before is: ", this.filtersCount);
    this.filters[name] ? this.filtersCount++ : this.filtersCount--;  // adjust count
    console.log("Filter count after is: ", this.filtersCount);
  }

  private updateDisplayedResults() {
    const that = this;

    if(this.filtersCount === 0) {
      this.resetListings();
    }
    else {
      // filters have name: false for ON and name: true for OFF. Get all of the ON(false) filters.
      const onFilters = Object.keys(that.filters).filter(filterName => that.filters[filterName] );

      // Show listing IF listing has ALL of selected filters
      this.filteredListings = this.listings.filter(function(listing) {
        let tagNames = listing.tags.map(t => t.name);
        return onFilters.every(filter => tagNames.indexOf(filter) > -1 );
      });
    }
  }
}
