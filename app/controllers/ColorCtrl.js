"use strict";

app.controller("ColorCtrl",
[
  "$scope",
  "$http",
  "firebaseURL",
  "$location",
  "authFactory",
  "colorspaceFactory",
  "imgProcessFactory",
  "kmeansFactory",
  "colorscaleFactory",

  function ($scope, $http, firebaseURL, $location, authFactory, colorspace, imgProcess, kmeans, colorscale ) {

    $scope.colorPicker = "#ffffff";
    $scope.pickerLightness;
    $scope.pickerSaturation;

    $scope.colors = $scope.chosenPalette.colors;
    $scope.paletteName = $scope.chosenPalette.name;
    $scope.clusterColors = null;
    $scope.saturationScale = null;
    $scope.complimentaryColor = null;
    $scope.imageUploaded = false;
    $scope.k = 3;

    //flickr search variables
    $scope.searchTerm;
    $scope.searchImgResults;
    $scope.flickrLoader = false;

    let canvas,
        ctx;

    angular.element(document).ready(function () {
      let imageLoader = $('#imageLoader');
      imageLoader.change(handleImage);
    });


    let hslcolor,
        hslSaturationScale,
        hexSaturationScale;

    let getSaturationScale = function (color) {
      //return the saturation scale for the input color as an array of hex values
      hslcolor = colorspace.hexToHsl(color);
      hslSaturationScale = colorscale.saturationScaleHSL(hslcolor, 0.1, 10);
      hexSaturationScale = hslSaturationScale.map((hslArr) => colorspace.hslToHex(hslArr));

      return hexSaturationScale;
    }


    $scope.updateScales = function () {
      //update saturationScale on $scope
        //future version might have lightness or hue scales
      $scope.saturationScale = getSaturationScale($scope.colorPicker);   
    }


    $scope.compliment = function () {
      //updates the complimentaryColor to be the compliment of the colorPicker
      let rgbArr = colorspace.hexToRgb($scope.colorPicker);
      $scope.complimentaryColor = colorspace.rgbToHex(colorspace.compliment(rgbArr));
    }
    

    $scope.add = function (newColor) {
      //dont allow more than 8 colors in a palette
      if ($scope.colors.length >= 8){
        console.log("only 8 colors per palette allowed");
        return
      }
      //dont allow duplicate colors
      for (let color in $scope.colors){
        if (newColor === $scope.colors[color]){
          return;
        }
      }
      $scope.colors.push(newColor);
    }
    
    $scope.setColor = function (color) {
      $scope.colorPicker = color;
      $scope.updateScales();
      $scope.compliment();
    }

    $scope.setLightness = function () {
      $scope.pickerLightness = colorspace.getLightnessFromHex($scope.colorPicker);
    }


    let hex,
        hsl,
        h,
        s,
        l,
        rgb,
        hexColor;

    $scope.hexFromLightness = function () {
      hex = $scope.colorPicker;
      hsl = colorspace.hexToHsl(hex);
      h = hsl[0];
      s = hsl[1] * 100;
      l = parseInt($scope.pickerLightness);

      rgb = colorspace.hslToRgb([h,s,l]);

      hexColor = colorspace.rgbToHex(rgb);
      // console.log("hexColor", hexColor);

      return hexColor;
    }
    
    //sw and sh are the width and height of the rectangle from which the ImageData will be extracted.
    let sw, sh;

    function handleImage(e){
      canvas = $('#imageCanvas')[0];
      ctx = canvas.getContext('2d');
      $scope.imageUploaded = true;
      $scope.$apply();
      let reader = new FileReader();
      reader.onload = function(event){
          let img = new Image();
          img.onload = function(){
              canvas.width = 300;
              canvas.height = 300;
              let size = imgProcess.fitImageOn(canvas, img, ctx);
              sw = size.sw;
              sh = size.sh;
              $scope.processImage();
              $scope.$apply();  
          }
          img.src = event.target.result;
      }
      reader.readAsDataURL(e.target.files[0]); 
    }


    $scope.processImage = () => {
      console.log("processing");
      let points = imgProcess.processImg(ctx, sw, sh);
      let k = parseInt($scope.k)

      let results = kmeans.kmeans(points, k, 10);

      console.log("results", results);

      //convert the cluster centers from rgb arrays to hex values
      $scope.clusterColors = results.map((clusters) => colorspace.rgbToHex(clusters[0]))
    }

    $scope.flickrSearch = () => {
      console.log("searching flickr");
      $scope.flickrLoader = true;

      canvas = $('#imageCanvas')[0];
      ctx = canvas.getContext('2d');

      let tags = $scope.searchTerm.replace(/\s/, ",");
      
      $http.get(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=411834a7e0dbf2349b1e95012621e5e2&tags=${tags}&format=json&nojsoncallback=1&per_page=30&media=photos&sort=interestingness-desc&safe_search=2`).then( (response) => {
          $scope.flickrLoader = false;
          console.log("response", response);
          //data is an array of photo objects
          let data = response.data.photos.photo;

          $scope.searchImgResults = data.map( function (obj){ 
              return {src: `https://farm${obj.farm}.staticflickr.com/${obj.server}/${obj.id}_${obj.secret}_m.jpg`}
              });
          //scroll down to the search results
          $scope.scrollTo("searchResults");
        }, (error) => console.log("error", error))
    };

    $scope.analyze = function (imgSrc) {
      //https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
      console.log("imgSrc", imgSrc);
      var img = new Image();
      img.crossOrigin = "Anonymous";


      img.onload = function() {
        canvas.width = 300;
        canvas.height = 300;
        let size = imgProcess.fitImageOn(canvas, img, ctx);
        sw = size.sw;
        sh = size.sh;


        localStorage.setItem( "savedImageData", canvas.toDataURL("image/png") );
        console.log("onload");
        $scope.processImage();
        $scope.$apply();
      }

      img.src= imgSrc;

      if ( img.complete || img.complete === undefined ) {
        console.log("complete");
        img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        img.src = src;
      }

      $scope.imageUploaded = true;
    }


    $scope.scrollTo= function(idStr) {
      document.getElementById(idStr).scrollIntoView()
    };
  }
]);