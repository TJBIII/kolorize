"use strict";

app.controller("PreviewCtrl",
[
  "$scope",
  "$location",
  "$http",
  "firebaseURL",

  function ($scope, $location, $http, firebaseURL) {
    $scope.chosenTemplate = 'partials/starter-template.html';

    $scope.setTemplate = (str) => $scope.chosenTemplate = str;

    



  }
]);