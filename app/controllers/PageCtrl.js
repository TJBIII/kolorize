"use strict";

app.controller("PageCtrl",
[
  "$scope",
  "$location",
  "$http",
  "authFactory",
  "firebaseURL",

  function ($scope, $location, $http, authFactory, firebaseURL) {

    $scope.palettes = [];


    // Local variables
    let ref = new Firebase(firebaseURL);

    $scope.isAuthenticated = () => {
      return authFactory.isAuthenticated();
    };

    /*
      Attempt to register a new user account.
      If successful, immediately log user in.
     */
    $scope.logout = () => {
      console.log("Unauthenticating user");
      ref.unauth();
    };


    //defualt palette;
    $scope.chosenPalette = { colors: ['#2a4d69','#4b86b4','#adcbe3','#e7eff6'] };

    $scope.setChosenPalette = function (palette) {
      $scope.chosenPalette = palette;
    }


  }
]);