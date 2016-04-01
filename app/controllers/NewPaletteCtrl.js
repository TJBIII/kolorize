"use strict";

app.controller("NewPaletteCtrl",
[
  "$scope",
  "$http",
  "firebaseURL",
  "authFactory",
  "$location",

  function ($scope, $http, firebaseURL, authFactory, $location) {

    //used for the save modal if user tries to navigate away before saving
    $scope.$parent.saveAlert = true;

    //reset the palette if one was being edited
    $scope.$parent.chosenPalette = { colors: [], name:"" };

    $scope.palette = $scope.$parent.chosenPalette;


    $scope.savePalette = function () {
      //don't need to show the save alert modal
      $scope.$parent.saveAlert = false;

      let user = authFactory.getUser();
      let newPalette = {
        name: $scope.palette.name,
        colors: $scope.palette.colors.join(','),
        uid: user.uid,
        forked: false
      };
      console.log("newPalette", newPalette);

      // POST the palette to Firebase
      $http.post(`${firebaseURL}/palettes.json`,

        // Remember to stringify objects/arrays before
        // sending them to an API
        JSON.stringify(newPalette)

      // The $http.post() method returns a promise, so you can use then()
      ).then(
        () => $location.url("/palettes"),      // Handle resolve
        (response) => console.log(response)  // Handle reject
      );
    };


    //if the user navigates away before saving open the save alert modal
    $scope.$on('$locationChangeStart', function( event ) {
      if ($scope.$parent.saveAlert) {
        $('#save-modal').openModal();
        event.preventDefault();
      }
    })

    $scope.closeSaveModal = function () {
      $('#save-modal').closeModal();
      $scope.$parent.saveAlert = false;
    }
}

]);