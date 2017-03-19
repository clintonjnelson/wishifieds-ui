import { Component } from '@angular/core';
import { User } from '../../users/user.model';
import { Sign } from '../../signs/sign.model';
import { SignpostApi } from '../../core/api/signpost-api.service';
import { ApiSignsService } from '../../core/api/api-signs.service';


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
  // isProcessing: boolean = false;   // wait for results to show
  hasSearched: boolean = false;    // dont show "0 results" before a search

  constructor(private apiSignsService: ApiSignsService,
              private signpostApi:     SignpostApi) {}

  search(event: any) {
    event.preventDefault();
    const that = this;
    console.log("SEARCHING CLICKED!");
    console.log("Search string is: ", this.searchStr);

    this.apiSignsService.search(that.searchStr)
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


// 'use strict';

// module.exports = function(app) {

//   app.controller('searchController', [
//     '$scope',
//     '$routeParams',
//     '$http',
//     function($scope, $routeParams, $http) {

//       console.log("ROUTE PARAMS IS: ", $routeParams);

// ************ AFTER CLICKING SEARCH, THERE WILL BE SEARCH PARAMS IN THE ROUTE
// ************ IF THEY EXIST, THIS MEANS WE NEED TO GRAB THOSE RESULTS & DISPLAY

//       var init = function() {
//         var paramsQuery = $routeParams.searchStr;
//         if(paramsQuery) {
//           databaseSearch(paramsQuery);
//         }
//       };
//       init();

//       $scope.searchStr = '';
//       $scope.users     = [];    // found users
//       $scope.signs     = [];    // found signs


//       $scope.searchUsers = function() {
//         console.log("SEARCHING CLICKED!");
//         console.log("Search string is: ", $scope.searchStr);

//         databaseSearch($scope.searchStr);
//       };

//       function databaseSearch(queryStr) {
//         $http.get('/search', {params: {'searchStr': queryStr} })
//           .success(function(data) {
//             console.log("SUCCESSFUL SEARCH. DATA IS: ", data);
//             $scope.users = data.users;
//             $scope.signs = data.signs;
//           })
//           .error(function(err) {
//             // TODO: SHOW ERROR MSG TO USER
//             console.log("Error searching.");
//           });
//       }
//     }
//   ]);
// };
