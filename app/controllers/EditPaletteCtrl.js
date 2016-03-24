"use strict";

app.controller("EditPaletteCtrl",
[
  "$scope",
  "$location",
  "$http",
  "firebaseURL",

  function ($scope, $location, $http, firebaseURL) {
    $scope.palette = $scope.$parent.chosenPalette;




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