"use strict";

app.controller("PaletteCtrl", [
  "$scope",
  "$location",
  "paletteFactory",
  "firebaseURL",

  function ($scope, $location, paletteFactory, firebaseURL) {
    // Default property values for keys bound to input fields
    $scope.newPalette = "";
    //empty palettes in parent scope to push updated data set into below
    $scope.$parent.palettes = [];

    $scope.search = {};

    // Invoke the promise that reads from Firebase
    paletteFactory().then(
      // Handle resolve() from the promise
      paletteCollection => {
        console.log("paletteCollection", paletteCollection);

        Object.keys(paletteCollection).forEach(key => {
          paletteCollection[key].id = key;
          //split colors string into array
          paletteCollection[key].colors = paletteCollection[key].colors.split(',');
          $scope.$parent.palettes.push(paletteCollection[key]);
       })

        // paletteArr.forEach(hex => {
        // paletteCollection[key].id = key;
        // $scope.palettes.push(paletteCollection[key]);
      },
      // Handle reject() from the promise
      err => console.log(err)
    );

  }
]);