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

    $scope.setTemplate = (str) => $scope.chosenTemplate = str;

    $scope.cycleColors = () => {
      const node = document.getElementById('template-node');
      $('#output').html('');

      let promises = [];
      let imgs = [];

      let colors = $scope.$parent.chosenPalette.colors

      // console.log($scope.$parent.chosenPalette);

      for (let i = 0, l = colors.length; i < l; i++){
        let currentPromise =  domtoimage.toPng(node)
            .then(function (dataUrl) {
                var img = new Image();
                img.src = dataUrl;
                imgs.push(img);
                console.log("current color", colors[i]);

                
              });

        //add current promise to the list of promises
        promises.push(currentPromise);

        //change css for next preview snapshot
        $('.navbar').css('backgroundColor', colors[i]);
      }


        //wait for all promises to resolve and then append preview images to the page
        $q.all(promises).then(()=> {
          imgs.forEach((element) => $('#output').append(element));
          })
      }


    }




    // $scope.cycleColors = () => {
    //   const node = document.getElementById('template-node');

    //   $('#output').html('');

    //   let imgs = [];


    //   domtoimage.toPng(node)
    //       .then(function (dataUrl) {
    //           var img = new Image();
    //           img.src = dataUrl;
    //           // imgs.push(img.src);
    //           // $('#output').append(img);
    //           imgs.push(img);

    //           //change the navbar/jumbotron color and make the next preview
    //           $('.navbar').css('backgroundColor', 'lightblue');
    //           $('.templateBody').css('backgroundColor', 'white');
    //           $('footer.page-footer').css('backgroundColor', 'pink');


    //               domtoimage.toPng(node)
    //                   .then(function (dataUrl) {
    //                       var img = new Image();
    //                       img.src = dataUrl;
    //                       // imgs.push(img.src);
    //                       // console.log("imgs", imgs);
    //                       // $('#output').append(img);

    //                       imgs.push(img);

    //                       //change back to starting values
    //                       $('.navbar').css('backgroundColor', 'black');
    //                       $('.jumbotron').css('backgroundColor', 'lightgrey');
    //                       $('footer.page-footer').css('backgroundColor', 'orange');


    //                       imgs.forEach((element) => $('#output').append(element));
    //                   })
    //                   .catch(function (error) {
    //                       console.error('oops, something went wrong!', error);
    //                   });
              
    //       })
    //       .catch(function (error) {
    //           console.error('oops, something went wrong!', error);
    //       });

]);