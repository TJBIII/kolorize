"use strict";

app.factory("paletteFactory", function ($q, $http, authFactory, firebaseURL){
   return { 
    getUsersPalettes() {
      return $q((resolve, reject) => {// Return a promise for our async XHR
        let user = authFactory.getUser();
        $http
          .get(`${firebaseURL}/palettes.json?orderBy="uid"&equalTo="${user.uid}"`)
          .success(
            palettes => resolve(palettes),
            error => reject(error)
          );
      })
    },

    getAllPalettes() {
      return $q((resolve, reject) => {// Return a promise for our async XHR
        $http
          .get(`${firebaseURL}/palettes.json`)
          .success(
            palettes => resolve(palettes),
            error => reject(error)
          );
      })
    }
  }

});
