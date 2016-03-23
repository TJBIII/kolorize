"use strict";

app.controller("PreviewCtrl",
[
  "$scope",
  "$location",
  "$http",
  "firebaseURL",
  "$q",

  function ($scope, $location, $http, firebaseURL, $q) {

    $scope.chosenTemplate = 'partials/starter-template.html';

    $scope.setTemplate = function (str) {
      $scope.chosenTemplate = str;
    }

    const node = document.getElementById('template-node');

    //array to hold all of the generated preview images
    let imgs = [];

    //array of colors from the palette
    let colors = $scope.$parent.chosenPalette.colors;






    let processDom = function () {
      //return promise, which is fulfilled with corresponding data URL
      //(PNG image base64-encoded data URL)
      return domtoimage.toPng(node);
    }


    let getPreviews = function(fn) {
      let iterator = fn();
      let loop = result => {
        !result.done && result.value.then(res =>
          loop(iterator.next(res)));
      };

      loop(iterator.next());
    };



    $scope.generatePreviews = function() {

      console.log("Generating Previews");

      //pass generator function to getPreviews
      getPreviews(function* () {
        for (let i = 0, l = colors.length; i < l; i++){

          //change css for next preview snapshot
          $('.navbar').css('backgroundColor', colors[i]);
          $('footer.page-footer').css('backgroundColor',  colors[i]);
          
          let dataUrl = yield processDom();
          var img = new Image();
          img.src = dataUrl;
          imgs.push(img);
          console.log("i", i);
        }
        console.log("done")
        imgs.forEach((element) => $('#output').append(element));
      })
    };

  }

]);