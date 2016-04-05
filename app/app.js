"use strict";

let app = angular.module("Kolorize", ["ngRoute", "firebase", "ui.sortable", "angular-clipboard", "akoenig.deckgrid"])
  .constant('firebaseURL', "https://kolorize.firebaseio.com/");


/*
  Define a promise for any view that needs an authenticated user
  before it will resolve (see below)
 */
let isAuth = (authFactory) => new Promise((resolve, reject) => {
  if (authFactory.isAuthenticated()) {
    // console.log("User is authenticated, resolve route promise");
    resolve();
  } else {
    // console.log("User is not authenticated, reject route promise");
    reject();
  }
});


/*
  Set up routes for app
 */
app.config(["$routeProvider",
  function ($routeProvider) {
    $routeProvider.
      when("/", {
        templateUrl: "partials/home.html"
      }).
      when("/login", {
        templateUrl: "partials/login.html",
        controller: "LoginCtrl"
      }).
      when("/logout", {
        templateUrl: "partials/login.html",
        controller: "LoginCtrl"
      }).
      when("/about", {
        templateUrl: "partials/about.html",
        controller: "AboutCtrl"
      }).
      when("/palettes", {
        templateUrl: "partials/palettes.html",
        controller: "PaletteCtrl",
        resolve: { isAuth }
      }).
      when("/new-palette", {
        templateUrl: "partials/new-palette.html",
        controller: "NewPaletteCtrl",
        resolve: { isAuth }
      }).
      when("/edit-palette", {
        templateUrl: "partials/edit-palette.html",
        controller: "EditPaletteCtrl",
        resolve: { isAuth }
      }).
      when("/preview", {
        templateUrl: "partials/preview.html",
        controller: "PreviewCtrl",
        resolve: { isAuth }
      }).
      when("/browse", {
        templateUrl: "partials/browse.html",
        controller: "BrowseCtrl",
        resolve: { isAuth }
      }).
      otherwise({
        redirectTo: "/"
      });
  }]);


/*
  When the application first loads, redirect the user to the login
  form if there is no authentication
 */
app.run([
  "$location",
  "firebaseURL",

  function ($location, firebaseURL) {
    let appRef = new Firebase(firebaseURL);

    appRef.onAuth(authData => {
      if (!authData) {
        // console.log("onAuth detected unauthenticated client");
        $location.path("/");
      }
    });
  }
]);
