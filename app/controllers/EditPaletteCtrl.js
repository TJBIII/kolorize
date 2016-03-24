"use strict";

app.controller("EditPaletteCtrl",
[
  "$scope",
  "$location",
  "$http",
  "firebaseURL",
  "Firebase",

  function ($scope, $location, $http, firebaseURL, Firebase) {
    $scope.colorPicker = "#ffffff";
    $scope.palette = $scope.$parent.chosenPalette;

    console.log("scope.palette", $scope.palette);


    $scope.add = function () {
      //dont allow more than 8 colors in a palette
      if ($scope.palette.colors.length >= 8){
        console.log("only 8 colors per palette allowed");
        return
      }
      //dont allow duplicate colors
      for (let color in $scope.palette.colors){
        if ($scope.colorPicker === $scope.palette.colors[color]){
          return;
        }
      }
      $scope.palette.colors.push($scope.colorPicker);
      $scope.updatePalette();
    }




    $scope.updatePalette = function () {
    
      console.log("palette", $scope.palette.id);

      let id = $scope.palette.id;

      let colorsStr = $scope.palette.colors.join(',');


      let paletteRef = new Firebase(`${firebaseURL}palettes/${id}`);

      // Modify the name and colors but leave everything else unchanged
      paletteRef.update({ name: $scope.palette.name, colors: colorsStr });



      // $.ajax({
      //   url: firebaseURL +`${id}`,
      //   method: 'POST'
      // })
      // .done(function() {
      //   console.log("palette updated on firebase");
      // })
      // .fail(function() {
      //   console.log("error while updating palette on firebase");
      // });



      // update the palette on Firebase
      // $http.post(`${firebaseURL}palettes/${id}.json`,

      //   // Remember to stringify objects/arrays before
      //   // sending them to an API
      //   JSON.stringify($scope.palette)

      // // The $http.post() method returns a promise, so you can use then()
      // ).then(
      //   () => $location.url("/palettes"),      // Handle resolve
      //   (response) => console.log(response)  // Handle reject
      // );
    };


    $scope.delete = function (palette) {
      //remove palette from palettes array
      let paletteIndex = $scope.$parent.palettes.indexOf(palette);
      if (paletteIndex >= 0) {
        $scope.$parent.palettes.splice(paletteIndex, 1);
      }

      //delete palette from firebase
      $.ajax({
        url: firebaseURL +`/palettes/${palette.id}.json`,
        method: 'DELETE'
      })
      .done(function() {
        console.log("palette deleted from firebase");
        $location.path("/palettes");
        $scope.$apply();
      })
      .fail(function() {
        console.log("error while deleting palette from firebase");
      });

    };

  }

]);