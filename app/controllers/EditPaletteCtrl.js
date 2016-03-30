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

    $scope.updateFirebase = function () {
      if ($scope.palette.colors.length > 0){
        console.log("updating", $scope.palette.id);
        let id = $scope.palette.id,
            colorsStr = $scope.palette.colors.join(',');

        let updatedPalette = {
          name: $scope.palette.name,
          colors: colorsStr
        };

        let paletteRef = new Firebase(`${firebaseURL}palettes/${id}`);
        // Modify the name and colors but leave everything else unchanged
        paletteRef.update(updatedPalette);
      }
    }


    //if a color is added or they order is changed, update firebase
    $scope.$watch('palette.colors', $scope.updateFirebase, true);



    $scope.deletePalette = function (palette) {
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

    $scope.deleteColor = function (color) {
      //remove color from chosenPalette array
      let colorIndex = $scope.palette.colors.indexOf(color);
      if (colorIndex >= 0) {
        $scope.palette.colors.splice(colorIndex, 1);
      }
    }

  }

]);