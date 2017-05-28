import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router }          from '@angular/router';
import { IconService }     from '../../core/services/icon.service';
import { ApiUsersService } from '../../core/api/api-users.service';
import { Sign }            from '../../signs/sign.model';
import { User }            from '../../users/user.model';

export class FilterIcon {
  icon:    string;
  bgColor: string;
}

@Component({
  moduleId: module.id,
  selector: 'search-results',
  templateUrl: 'search-results.component.html',
  styleUrls:  ['search-results.component.css']
})


/*
  This Component shows the search results
   Initially, it starts with no filters on, so it shows everything.
   After a filter is clicked, it shows ONLY the type(s) selected
   The count tracks whether there is filtering (count > 0) or NO filtering (count = 0)
   Filtering is done based on the icon name, as icons act as an identifier
 */
export class SearchResultsComponent implements OnInit, OnChanges {
  @Input() users: User[];
  @Input() signs: Sign[];

  filteredUsers: User[];
  filteredSigns: Sign[];
  filters:       Object;      // Object of icon names. Values: false(show), true(hide)
  filterIcons:   FilterIcon[];
  filtersCount:  number;  // start with no filters


  constructor(private icons:           IconService,
              private apiUsersService: ApiUsersService,
              private router:          Router) {}

  // Set no initial filters, show all (not exclusive)
  ngOnInit() {
    this.resetFilters();
    console.log("Filters init is: ", this.filters);
    console.log("Filtered Signs init is: ", this.filteredSigns);
    console.log("FilterIcons at init is: ", this.filterIcons);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.signs = changes.signs.currentValue;
    this.users = changes.users.currentValue;
    this.resetFilters();
  }

  filter(filterIcon: FilterIcon) {
    this.toggleFilterByIcon(filterIcon.icon);
    this.updateResults();  // this should update the signs shown
    console.log("Filters final is: ", this.filters);
    console.log("Filtered Signs after update is: ", this.filteredSigns);
  }


  // *********** HELPERS *************
  private generateFiltersAndIcons() {
    const that = this;
    this.signs.forEach((sign) => {
      // If already added, break. Else add to filters & displayIcons
      if(that.filters.hasOwnProperty(sign.icon)) { return; }
      else {
        addToFilters(sign);
        addDisplayIcon(sign);
      }
    });

    function addToFilters(sign: Sign) {
      that.filters[sign.icon] = false;
    }
    function addDisplayIcon(sign: Sign) {
      that.filterIcons.push({icon: sign.icon, bgColor: sign.bgColor});
    }
  }

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  goToUserPage(userId: string, event: any) {
    event.preventDefault();
    this.apiUsersService.getUsernameByUserId(userId)
        .subscribe(
          res => {
            console.log("RESPONSE FROM GETUSERNAMEBYUSERID IS: ", res);
            this.router.navigate(['/', res.username]);
          },
          error => {

          });
  }

  private toggleFilterByIcon(icon: string) {
    this.filters[icon] = !this.filters[icon];
    // THIS LINE SHOULD BE TESTED, AS AN EDGE CASE COULD CAUSE ISSUE....
    console.log("Filter count before is: ", this.filtersCount);
    this.filters[icon] ? this.filtersCount++ : this.filtersCount--;  // adjust count
    console.log("Filter count after is: ", this.filtersCount);
  }

  private updateResults() {
    if(this.filtersCount === 0) {
      this.resetSigns();
    }
    else {
      const that = this;
      // If compare sign icon to filter list to see if allow or not
      this.filteredSigns = this.signs.filter((sign) => { return that.filters[sign.icon]; });  // true will keep
    }
  }

  private resetFilters() {
    this.filters      = {};
    this.filterIcons  = [];
    this.filtersCount = 0;
    this.generateFiltersAndIcons();
    this.resetSigns();
  }

  private resetSigns() {
    // Make copies of orig arrays to reset the display arrays
    this.filteredUsers = this.users.slice();
    this.filteredSigns = this.signs.slice();
  }
}

