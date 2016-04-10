"use strict";

app.factory("userFactory", function ($q, $http, authFactory, firebaseURL){
   return { 
    getUserInfo() {
      return $q((resolve, reject) => {// Return a promise for our async XHR
        let user = authFactory.getUser();
        $http
          .get(`${firebaseURL}/users.json?orderBy="uid"&equalTo="${user.uid}"`)
          .success(
            userInfo => resolve(userInfo),
            error => reject(error)
          );
      })
    },

    getUserInfoFromUsername (username) {
      return $q((resolve, reject) => {// Return a promise for our async XHR
        $http
          .get(`${firebaseURL}/users.json?orderBy="uName"&equalTo="${username}"`)
          .success(
            userInfo => resolve(userInfo),
            error => reject(error)
          );
      })

    }
  }

});
