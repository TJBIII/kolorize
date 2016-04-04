"use strict";

app.controller("PageCtrl",
[
  "$scope",
  "$location",
  "$http",
  "authFactory",
  "firebaseURL",
  "colorspaceFactory",
  "imgProcessFactory",
  "kmeansFactory",
  "colorscaleFactory",

  function ($scope, $location, $http, authFactory, firebaseURL, colorspace,  imgProcess, kmeans, colorscale) {

    $scope.palettes = [];

    // Local variables
    let ref = new Firebase(firebaseURL);

    $scope.isAuthenticated = () => {
      return authFactory.isAuthenticated();
    };

    $scope.getUserID = () => {
      let userData = authFactory.getUser();
      return userData.uid;
    }

    /*
      Attempt to register a new user account.
      If successful, immediately log user in.
     */
    $scope.logout = () => {
      console.log("Unauthenticating user");
      ref.unauth();
    };


    //defualt empty palette;
    $scope.chosenPalette = { colors: [],
                            name:"" };

    $scope.setChosenPalette = function (palette) {
      $scope.chosenPalette = palette;
    }

    //used to decide whether to display black or white menu icon
    $scope.getLightness = function (color) {
      return Math.round(colorspace.getLightnessFromHex(color));
    }

    //used to decide whether to display save alert modal on new-palette page
    $scope.saveAlert;

    $scope.deleteColor = function (hexStr) {
      // console.log("color to delete", color);
      let colorIdx = $scope.chosenPalette.colors.indexOf(hexStr);
      if (colorIdx >= 0) {
        $scope.chosenPalette.colors.splice(colorIdx, 1);
      }
    }

    $scope.clipSuccess = function (color) {
            // console.log('Copied!');
            Materialize.toast(`Copied ${color} to clipboard`, 2000)
    };
  }
]);