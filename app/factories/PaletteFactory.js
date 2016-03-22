"use strict";

app.factory("paletteFactory", ($q, $http, authFactory, firebaseURL) =>
  () =>
    $q((resolve, reject) => {// Return a promise for our async XHR
      let user = authFactory.getUser();
      $http
        .get(`${firebaseURL}/palettes.json?orderBy="uid"&equalTo="${user.uid}"`)
        .success(
          songCollection => resolve(songCollection),
          error => reject(error)
        );
    })
);
