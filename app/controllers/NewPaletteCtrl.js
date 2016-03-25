"use strict";

app.controller("NewPaletteCtrl",
[
  "$scope",
  "$http",
  "firebaseURL",
  "authFactory",
  "$location",
  "colorspaceFactory",

  function ($scope, $http, firebaseURL, authFactory, $location, colorspaceFactory) {

    $scope.colorPicker = "#ffffff";

    $scope.palette = [];
    $scope.paletteName = "";


    $scope.compliment = function () {
      let rgbArr = colorspaceFactory.hexToRgb($scope.colorPicker);
      colorspaceFactory.compliment(rgbArr);
    }
    

    $scope.add = function () {
      //dont allow more than 8 colors in a palette
      if ($scope.palette.length >= 8){
        console.log("only 8 colors per palette allowed");
        return
      }
      //dont allow duplicate colors
      for (let color in $scope.palette){
        if ($scope.colorPicker === $scope.palette[color]){
          return;
        }
      }
      $scope.palette.push($scope.colorPicker);
    }
    

    $scope.savePalette = function () {
      let user = authFactory.getUser();
      let newPalette = {
        name: $scope.paletteName,
        colors: $scope.palette.join(','),
        uid: user.uid
      };
      console.log("newPalette", newPalette);

      // POST the palette to Firebase
      $http.post(`${firebaseURL}/palettes.json`,

        // Remember to stringify objects/arrays before
        // sending them to an API
        JSON.stringify(newPalette)

      // The $http.post() method returns a promise, so you can use then()
      ).then(
        () => $location.url("/palettes"),      // Handle resolve
        (response) => console.log(response)  // Handle reject
      );
    };



    let deleteColor = function (hexStr) {
      let colorIdx = $scope.palette.indexOf(hexStr);
      if (colorIdx >= 0) {
        $scope.palette.splice(colorIdx, 1);
      }
      $scope.$apply();
    }




    let imageLoader = $('#imageLoader');

    imageLoader.change(handleImage);

    let canvas = $('#imageCanvas')[0];
    let ctx = canvas.getContext('2d');


    function handleImage(e){
      var reader = new FileReader();
      reader.onload = function(event){
          var img = new Image();
          img.onload = function(){
              // canvas.width = img.width;
              // canvas.height = img.height;
              // ctx.drawImage(img,0,0);
              fitImageOn(canvas, img)
          }
          img.src = event.target.result;
      }
      reader.readAsDataURL(e.target.files[0]);     
    }


    var fitImageOn = function(canvas, imageObj) {
      //adapted from blog below to resize canvas to final image dimensions after fitting
      //the image to the original, starting canvas size
      //http://sdqali.in/blog/2013/10/03/fitting-an-image-in-to-a-canvas-object/
      var imageAspectRatio = imageObj.width / imageObj.height;
      var canvasAspectRatio = canvas.width / canvas.height;
      var renderableHeight, renderableWidth, xStart, yStart;

      // If image's aspect ratio is less than canvas's we fit on height
      // and place the image centrally along width
      if(imageAspectRatio < canvasAspectRatio) {
        renderableHeight = canvas.height;
        renderableWidth = imageObj.width * (renderableHeight / imageObj.height);
        xStart = (canvas.width - renderableWidth) / 2;
        yStart = 0;
      }

      // If image's aspect ratio is greater than canvas's we fit on width
      // and place the image centrally along height
      else if(imageAspectRatio > canvasAspectRatio) {
        renderableWidth = canvas.width
        renderableHeight = imageObj.height * (renderableWidth / imageObj.width);
        xStart = 0;
        yStart = (canvas.height - renderableHeight) / 2;
      }

      // Happy path - keep aspect ratio
      else {
        renderableHeight = canvas.height;
        renderableWidth = canvas.width;
        xStart = 0;
        yStart = 0;
      }

      //set the canvas to the resized image dimensions
      canvas.width = renderableWidth;
      canvas.height = renderableHeight;

      ctx.drawImage(imageObj, 0, 0, renderableWidth, renderableHeight);
    };



    $scope.processImage = function () {
      //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D

      //create points array to store [R,G,B] formated point color values
      var points = [];

      //getImageData().data is a read-only 1D array in RGBA order
      let data = ctx.getImageData(0, 0, 200, 200).data;
      console.log("data", data);
      for (var i = 0; i < data.length; i += 4){
        //i will always be at the index of the R value in RGBA sequence
        var r = data[i];
        var g = data[i+1];
        var b = data[i+2];
        points.push([r,g,b]);
      }
      console.log("points", points);
    }


  }

]);