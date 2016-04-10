"use strict";

app.controller("BrowseCtrl", [
  "$scope",
  "$http",
  "$location",
  "paletteFactory",
  "firebaseURL",
  "authFactory",
  "userFactory",

  function ($scope, $http, $location, paletteFactory, firebaseURL, authFactory, userFactory) {
    //empty palettes in parent scope to push updated data set into below
    $scope.$parent.palettes = [];

    $scope.search = "";

    $scope.userId = authFactory.getUser().uid;

    //hold the username
    let uName;

    userFactory.getUserInfo()
    .then((userInfo) => {
      console.log("userInfo", userInfo[Object.keys(userInfo)].uName);
      uName = userInfo[Object.keys(userInfo)].uName
    });
    

    // Invoke the promise that reads from Firebase
    paletteFactory.getAllPalettes().then(
      // Handle resolve() from the promise
      paletteCollection => {
        console.log("paletteCollection", paletteCollection);

        Object.keys(paletteCollection).forEach(key => {
          //only take palettes not belonging to user
          if ($scope.userId !== paletteCollection[key].uid){

            paletteCollection[key].id = key;
            //split colors string into array
            paletteCollection[key].colors = paletteCollection[key].colors.split(',');
            $scope.$parent.palettes.push(paletteCollection[key]);
          }
       })
        //randomize the order of the palettes
        $scope.$parent.shuffle($scope.$parent.palettes)
      },
      // Handle reject() from the promise
      err => console.log(err)
    );


    $scope.fork = function (palette) {
      let newPalette = {
        name: palette.name,
        colors: palette.colors.join(','),
        uid: $scope.userId, 
        forked: true,
        uName: uName
      };

      console.log("new forked palette", newPalette);
      // POST the palette to Firebase
      $http.post(`${firebaseURL}/palettes.json`,

        // Remember to stringify objects/arrays before
        // sending them to an API
        JSON.stringify(newPalette)

      // The $http.post() method returns a promise, so you can use then()
      ).then(
        () => $location.url("#/palettes"), //take user to their palettes page
        (response) => console.log(response)  // Handle reject
      );
    };

  }
]);