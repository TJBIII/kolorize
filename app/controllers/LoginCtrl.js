"use strict";

app.controller("LoginCtrl",
[
  "$scope",
  "$location",
  "$http",
  "authFactory",
  "firebaseURL",

  function ($scope, $location, $http, authFactory, firebaseURL) {

    // Local variables
    let ref = new Firebase(firebaseURL);

    // Variables on $scope for use in DOM
    $scope.account = { email: "", password: "", name: "", userName: ""};
    $scope.message = "";

    /*
      Attempt to register a new user account.
      If successful, immediately log user in.
     */
    $scope.register = () => {
      ref.createUser({
        email    : $scope.account.email,
        password : $scope.account.password
      }, (error, authData) => {
        if (error) {
          console.log(`Error creating user: ${error}`);
        } else {
          console.log(`Created user account with uid: ${authData.uid}`);
          //add the new user's information to firebase
          let userObj = { uid: authData.uid, uName: $scope.account.userName}
          authFactory.storeUser(userObj);
          $scope.login();
        }
      });
    };

    /*
      Attempt to authenticate the user with the
      supplied credentials.
     */
    $scope.login = () =>
      authFactory
        .authenticate($scope.account)
        .then(() => {
          $location.path("/palettes");
          $scope.$apply();  // Needed for $location.path() to succeed
        });
  }
]);