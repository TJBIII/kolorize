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
      //get all non-forked palettes
      return $q((resolve, reject) => {// Return a promise for our async XHR
        $http
          .get(`${firebaseURL}/palettes.json?orderBy="forked"&equalTo=false`)
          .success(
            palettes => resolve(palettes),
            error => reject(error)
          );
      })
    },

    getPalettesByUsername(username) {
      return $q((resolve, reject) => {// Return a promise for our async XHR
        $http
          .get(`${firebaseURL}/palettes.json?orderBy="uName"&equalTo="${username}"`)
          .success(
            palettes => resolve(palettes),
            error => reject(error)
          );
      })
    }
  }

});
