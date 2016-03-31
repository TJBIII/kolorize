"use strict";

app.controller("PreviewCtrl",
[
  "$scope",
  "$location",
  "$http",
  "firebaseURL",

  function ($scope, $location, $http, firebaseURL) {

    $scope.chosenTemplate = 'previews/starter-template.html';
    $scope.blurMode = false;
    $scope.previews = [];


    //hold the list of color permutations
    let colorPermutations;
    $scope.nav;
    $scope.body;
    $scope.footer;


    $scope.toggleBlur = function () {
      if ($scope.blurMode){
        $('#output').children().removeClass('blurred');
        $scope.blurMode = false;
      } else {
        $('#output').children().addClass('blurred');
        $scope.blurMode = true;
      }
    };


    //loading modal
    $(document).ready(function(){
      // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
      $('.modal-trigger').leanModal({
        dismissible: false, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        in_duration: 300, // Transition in duration
        out_duration: 200, // Transition out duration
      });
    });
         

    $scope.setTemplate = function (str) {
      $scope.chosenTemplate = str;
    }

    const node = document.getElementById('template-node');


    let permutator = function (inputArr) {
      let permutations = [];

      function permute(arr, memo) {
        var cur, memo = memo || [];

        for (var i = 0; i < arr.length; i++) {
          cur = arr.splice(i, 1);
          if (arr.length === 0) {
            permutations.push(memo.concat(cur));
          }
          permute(arr.slice(), memo.concat(cur));
          arr.splice(i, 0, cur[0]);
        }
        return permutations;
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
      //remove old previews (if any)
      $scope.previews = [];

      //array of colors from the palette
      //only take the first 3 colors
      let colors = $scope.$parent.chosenPalette.colors.slice(0, 3);

      //array to hold all of the generated preview image srcs
      let imgs = [];

      console.log("Generating Previews");
      var start = new Date().getTime();

      colorPermutations = permutator(colors);
      console.log("colorPermutations", colorPermutations);
      let numColorPermutations = colorPermutations.length;

      let currentPermutation;

      let $nav = $('.navbar');
      let $footer = $('footer.page-footer');
      let $body = $('.templateBody');
      let $loaderProgress = $('#loader-progress');


      //pass generator function to getPreviews
      getPreviews(function* () {
        for (let idx in colorPermutations){

          currentPermutation = colorPermutations[idx];

          //change css for next preview snapshot
          $nav.css('backgroundColor', currentPermutation[0]);
          $body.css('backgroundColor',  currentPermutation[1]);
          $footer.css('backgroundColor',  currentPermutation[2]);

          
          let dataUrl = yield processDom();
          imgs.push(dataUrl);

          //update the loader modal progress bar
          //idx starts at 0 so add 1 to get number of completed previews
          let percentComplete = ((parseInt(idx)+1)/numColorPermutations)*100;
          // console.log("percentComplete", percentComplete);
          $loaderProgress.css('width', `${percentComplete}%`);

        }
        
        // console.log("done");
        var end = new Date().getTime();
        var time = end - start;
        console.log('Execution time: ' + time);

        //place new previews on the page-footer
        $scope.previews = imgs;
        $scope.$apply();

        //close the loader modal and reset progress to zero
        $('#loader-modal').closeModal();
        $loaderProgress.css('width', `0%`);
      })
    };


    $scope.setModal = function (idx) {
      console.log("idx", idx);
      let permutation = colorPermutations[idx];
      $scope.nav = permutation[0];
      $scope.body = permutation[1];
      $scope.footer = permutation[2];

      //open the modal to show the nav, body, and footer colors/hex values
      $('#preview-modal').openModal();

    }
  }

]);