import { Component } from '@angular/core';
import { User } from '../../users/user.model';
import { Sign } from '../../signs/sign.model';

const FOUND_USERS: User[] = [
  { username: "Jen",   picUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Official_portrait_of_Barack_Obama.jpg", status: "active" },
  { username: "Clint", picUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/44_Bill_Clinton_3x4.jpg/220px-44_Bill_Clinton_3x4.jpg", status: "active"},
  { username: "Eilee", picUrl: "", status: "active" },
  { username: "Clara", picUrl: "", status: "active" },
];

const OAUTH_FACEBOOK_SIGN: Sign = {
    _id: '12345',
    bgColor: '#3b5998',
    description: 'some sign',
    icon: 'facebook',
    knownAs: 'my name',
    linkUrl: 'http://facebook.com',
    picUrl: '',
    signName: 'facebook',
    signType: 'oauth',
    username: 'myactualusername',
    owner: 'signowner'
  };
const CUSTOM_ETSY_SIGN: Sign = {
    _id: '54321',
    bgColor: 'orange',
    description: 'etsy sign',
    icon: 'etsy',
    knownAs: 'my etsy name',
    linkUrl: 'http://etsy.com',
    picUrl: 'https://il5.picdn.net/shutterstock/videos/3178849/thumb/1.jpg',
    signName: 'etsy',
    signType: 'custom',
    username: 'myetsyusername',
    owner: 'signowner'
};

const FOUND_SIGNS: Sign[] = [
  OAUTH_FACEBOOK_SIGN,
  CUSTOM_ETSY_SIGN
];


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

  searchUsers() {
    console.log("SEARCH USERS TRIGGERED");
    this.foundUsers = FOUND_USERS;
    this.foundSigns = FOUND_SIGNS;


    //         console.log("SEARCHING CLICKED!");
    //         console.log("Search string is: ", $scope.searchStr);

    //         databaseSearch($scope.searchStr);

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
