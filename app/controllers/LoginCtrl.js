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
    let usersRef = new Firebase(`${firebaseURL}users`);

    // Variables on $scope for use in DOM
    $scope.account = { email: "", password: "", name: "", userName: ""};
    $scope.message = "";
    $scope.registerMode = false;

    let validated = false;

    $scope.validate = function () {
      usersRef.startAt(null, $scope.account.userName).endAt(null, $scope.account.userName).on("value", function(snapshot) {
        // console.log("new snapshot.val()", snapshot.val());
        if (snapshot.val() === null) {
          // username not taken
          validated =  true;
        } else {
          // username taken
          validated = false;
        }  
        $scope.register()
      });
    }
    /*
      Attempt to register a new user account.
      If successful, immediately log user in.
     */
    $scope.register = () => {

      if (validated) {
        // console.log("validated is true");
        ref.createUser({
          email    : $scope.account.email,
          password : $scope.account.password
        }, (error, authData) => {
          if (error) {
            Materialize.toast(`${error}`, 4000);
            console.log(`Error creating user: ${error}`);
          } else {
            console.log(`Created user account with uid: ${authData.uid}`);
            //add the new user's information to firebase
            let userObj = { uid: authData.uid, uName: $scope.account.userName, name: $scope.account.name}
            authFactory.storeUser(userObj);
            $scope.login();
          }
        });
      } 
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