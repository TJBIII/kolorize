"use strict";

let app = angular.module("Kolorize", ["ngRoute", "firebase"])
  .constant('firebaseURL', "https://kolorize.firebaseio.com/");)


/*
  Define a promise for any view that needs an authenticated user
  before it will resolve (see below)
 */
let isAuth = (authFactory) => new Promise((resolve, reject) => {
  if (authFactory.isAuthenticated()) {
    console.log("User is authenticated, resolve route promise");
    resolve();
  } else {
    console.log("User is not authenticated, reject route promise");
    reject();
  }
});
