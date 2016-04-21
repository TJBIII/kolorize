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
  "userFactory",

  function ($scope, $location, $http, authFactory, firebaseURL, colorspace,  imgProcess, kmeans, colorscale, userFactory) {

    //store users palettes separate from other palettes so that they can just be updated
    // if there are any differences once the data is pulled from firebase. (get rid of waiting times)
    //hold other users palettes/palettes to browse
    $scope.palettes = [];
    //hold the logged in user's palettes
    $scope.userPalettes = [];

    // Local variables
    let ref = new Firebase(firebaseURL);

    $scope.isAuthenticated = () => {
      return authFactory.isAuthenticated();
    };

    $scope.getUserID = () => {
      let userData = authFactory.getUser();
      return userData.uid;
    }

    $scope.isActive = function(viewLocation) {
      return $location.path().indexOf(viewLocation) === 0;
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

    //https://github.com/coolaj86/knuth-shuffle
    $scope.shuffle = function (array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    };
  }
]);