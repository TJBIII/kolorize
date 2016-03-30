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
    $scope.$parent.chosenPalette = { colors: [],
                            name:"" };


    //set up the collapsible menu
    $(document).ready(function(){
      $('.collapsible').collapsible({
        accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
      });
    });

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