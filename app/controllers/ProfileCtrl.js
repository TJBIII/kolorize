"use strict";

app.controller("ProfileCtrl", [
  "$scope",
  "$http",
  "$location",
  "paletteFactory",
  "firebaseURL",
  "authFactory",
  "userFactory",
  "$routeParams",

  function ($scope, $http, $location, paletteFactory, firebaseURL, authFactory, userFactory, $routeParams) {

    $scope.search = "";

    let profileName = $routeParams.username;
    let userInfo;

    //empty palettes in parent scope to push updated data set into below
    $scope.$parent.palettes = [];


    $scope.profileuName;
    $scope.profilename;


    userFactory.getUserInfoFromUsername(profileName).then(
      (userInfo) => {
        userInfo = userInfo[Object.keys(userInfo)];
        console.log("uid", userInfo);
        $scope.profileuName = userInfo.uName;
        $scope.profilename = userInfo.name;
      });


    paletteFactory.getPalettesByUsername(profileName).then(
      // Handle resolve() from the promise
      paletteCollection => {
        console.log("paletteCollection", paletteCollection);

        Object.keys(paletteCollection).forEach(key => {
          paletteCollection[key].id = key;
          //split colors string into array
          paletteCollection[key].colors = paletteCollection[key].colors.split(',');
          $scope.$parent.palettes.push(paletteCollection[key]);
       })
      },
      // Handle reject() from the promise
      err => console.log(err)
    );

    $scope.userId = authFactory.getUser().uid;

    //hold the current user's username
    let uName;

    userFactory.getUserInfo()
    .then((userInfo) => {
      // console.log("userInfo", userInfo[Object.keys(userInfo)].uName);
      uName = userInfo[Object.keys(userInfo)].uName
    });
    

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