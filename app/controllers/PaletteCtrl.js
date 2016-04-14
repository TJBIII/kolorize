"use strict";

app.controller("PaletteCtrl", [
  "$scope",
  "$location",
  "paletteFactory",
  "firebaseURL",
  "userFactory",

  function ($scope, $location, paletteFactory, firebaseURL, userFactory) {
    $scope.search = "";

    //holded the logged in user's username
    $scope.uName;

    userFactory.getUserInfo().then((userInfo) => {
      console.log("user", userInfo);
      $scope.uName = userInfo[Object.keys(userInfo)].uName
    });

    let userPalettesUpdated = [];

    // Invoke the promise that reads from Firebase
    paletteFactory.getUsersPalettes().then(
      // Handle resolve() from the promise
      paletteCollection => {
        console.log("paletteCollection", paletteCollection);

        Object.keys(paletteCollection).forEach(key => {
          paletteCollection[key].id = key;
          //split colors string into array
          paletteCollection[key].colors = paletteCollection[key].colors.split(',');
          userPalettesUpdated.push(paletteCollection[key]);
       });
        //update the parent scope userpalettes array that is being displayed on the page
        $scope.$parent.userPalettes = userPalettesUpdated;
      },
      // Handle reject() from the promise
      err => console.log(err)
    );
  }
]);