"use strict";

app.controller("PaletteCtrl", [
  "$scope",
  "$location",
  "paletteFactory",

  function ($scope, $location, paletteFactory) {
    // Default property values for keys bound to input fields
    $scope.newPalette = "";
    $scope.palettes = [];

    // Invoke the promise that reads from Firebase
    paletteFactory().then(
      // Handle resolve() from the promise
      paletteCollection => {
        console.log("paletteCollection", paletteCollection);

        Object.keys(paletteCollection).forEach(key => {
          paletteCollection[key].id = key;
          //split colors string into array
          paletteCollection[key].colors = paletteCollection[key].colors.split(',');
          $scope.palettes.push(paletteCollection[key]);
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