"use strict";

app.controller("PaletteCtrl", [
  "$scope",
  "$location",
  "paletteFactory",
  "firebaseURL",
  "userFactory",

  function ($scope, $location, paletteFactory, firebaseURL, userFactory) {
    //empty palettes in parent scope to push updated data set into below
    $scope.$parent.palettes = [];

    $scope.search = "";

    //holded the logged in user's username
    $scope.uName;

    userFactory.getUserInfo().then((userInfo) => {
      console.log("user", userInfo);
      $scope.uName = userInfo[Object.keys(userInfo)].uName
    });


    // Invoke the promise that reads from Firebase
    paletteFactory.getUsersPalettes().then(
      // Handle resolve() from the promise
      paletteCollection => {
        console.log("paletteCollection", paletteCollection);

        Object.keys(paletteCollection).forEach(key => {
          paletteCollection[key].id = key;
          //split colors string into array
          paletteCollection[key].colors = paletteCollection[key].colors.split(',');
          $scope.$parent.palettes.push(paletteCollection[key]);
       })
      },
      // Handle reject() from the promise
      err => console.log(err)
    );
  }
]);