"use strict";

app.controller("EditPaletteCtrl",
[
  "$scope",
  "$location",
  "$http",
  "firebaseURL",

  function ($scope, $location, $http, firebaseURL) {
    $scope.palette = [];
    $scope.paletteName = "";

  }

]);