"use strict";

app.factory("authFactory", ($http, firebaseURL) => {
  let ref = new Firebase(firebaseURL);
  let currentUserData = null;

  return {
    /*
      Determine if the client is authenticated
     */
    isAuthenticated () {
      let authData = ref.getAuth();

      if (authData) {
        currentUserData = authData;
        return true;
      } else {
        return false;
      }
    },

    getUser () {
      return currentUserData;
    },

    /*
      Authenticate the client via Firebase
     */
    authenticate (credentials) {
      return new Promise((resolve, reject) => {
        ref.authWithPassword({
          "email": credentials.email,
          "password": credentials.password
        }, (error, authData) => {
          if (error) {
            reject(error);
          } else {
            console.log("authWithPassword method completed successfully");
            resolve(authData);
          }
        });
      });
    },

    /*
      Authenticate the client via Firebase
     */
    storeUser (userObj) {
      console.log("userObj from authfactory", userObj);
      // console.log("authData",authData);
      // return new Promise((resolve, reject) => {
      //   $http.post(`${firebaseURL}/users.json`, JSON.stringify(userObj))
      //     .then(() => {
      //       resolve();
      //     });
      // });

      let userRef = ref.child(`users/${userObj.uName}`);
      userRef.set(userObj);
    }


  };
});
