"use strict";

app.controller("BrowseCtrl", [
  "$scope",
  "$http",
  "$location",
  "paletteFactory",
  "firebaseURL",
  "authFactory",

  function ($scope, $http, $location, paletteFactory, firebaseURL, authFactory) {
    //empty palettes in parent scope to push updated data set into below
    $scope.$parent.palettes = [];

    $scope.search = {};

    $scope.userId = authFactory.getUser().uid;

    // Invoke the promise that reads from Firebase
    paletteFactory.getAllPalettes().then(
      // Handle resolve() from the promise
      paletteCollection => {
        console.log("paletteCollection", paletteCollection);

        Object.keys(paletteCollection).forEach(key => {
          //only take palettes not belonging to user
          if ($scope.userId !== paletteCollection[key].uid){

            paletteCollection[key].id = key;
            //split colors string into array
            paletteCollection[key].colors = paletteCollection[key].colors.split(',');
            $scope.$parent.palettes.push(paletteCollection[key]);
          }
       })
      },
      // Handle reject() from the promise
      err => console.log(err)
    );


    $scope.fork = function (palette) {

      let newPalette = {
        name: palette.name,
        colors: palette.colors.join(','),
        uid: $scope.userId, 
        forked: true
      };

      console.log("new forked palette", newPalette);
      // POST the palette to Firebase
      $http.post(`${firebaseURL}/palettes.json`,

        // Remember to stringify objects/arrays before
        // sending them to an API
        JSON.stringify(newPalette)

      // The $http.post() method returns a promise, so you can use then()
      ).then(
        () => {
          //set chosenPalette to be used at edit-palette
          $scope.setChosenPalette({
            name: palette.name,
            colors: palette.colors,
            uid: $scope.userID,
            forked: true
          });
          //take user to edit their newly forked palette
          $location.url("/edit-palette")
        },      // Handle resolve
        (response) => console.log(response)  // Handle reject
      );
    };

  }
]);