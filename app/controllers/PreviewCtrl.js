"use strict";

app.controller("PreviewCtrl",
[
  "$scope",
  "$location",
  "$http",
  "firebaseURL",

  function ($scope, $location, $http, firebaseURL) {

    $scope.chosenTemplate = 'partials/starter-template.html';

    $scope.setTemplate = function (str) {
      $scope.chosenTemplate = str;
    }

    const node = document.getElementById('template-node');


    let permutator = function (inputArr) {
      var results = [];

      function permute(arr, memo) {
        var cur, memo = memo || [];

        for (var i = 0; i < arr.length; i++) {
          cur = arr.splice(i, 1);
          if (arr.length === 0) {
            results.push(memo.concat(cur));
          }
          permute(arr.slice(), memo.concat(cur));
          arr.splice(i, 0, cur[0]);
        }
        return results;
      }
      return permute(inputArr);
    };



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


      //array of colors from the palette
      //only take the first 3 colors
      let colors = $scope.$parent.chosenPalette.colors.slice(0, 3);

      //array to hold all of the generated preview images
      let imgs = [];

      console.log("Generating Previews");
      var start = new Date().getTime();

      let colorPermutations = permutator(colors);
      let currentPermutation;

      //pass generator function to getPreviews
      getPreviews(function* () {
        for (let idx in colorPermutations){

          currentPermutation = colorPermutations[idx];
          //change css for next preview snapshot
          $('.navbar').css('backgroundColor', currentPermutation[0]);
          $('footer.page-footer').css('backgroundColor',  currentPermutation[1]);
          $('.templateBody').css('backgroundColor',  currentPermutation[2]);

          
          let dataUrl = yield processDom();
          var img = new Image();
          img.src = dataUrl;
          imgs.push(img);
          console.log("idx", idx);
        }
        console.log("done");
        var end = new Date().getTime();
        var time = end - start;
        console.log('Execution time: ' + time);

        //remove old previews (if any) and place new ones on the page
        $('#output').html('');
        imgs.forEach((element) => $('#output').append(element));
      })
    };

  }

]);