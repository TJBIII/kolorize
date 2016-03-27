"use strict";

app.controller("NewPaletteCtrl",
[
  "$scope",
  "$http",
  "firebaseURL",
  "authFactory",
  "$location",
  "colorspaceFactory",
  "imgProcessFactory",
  "kmeansFactory",
  "colorscaleFactory",

  function ($scope, $http, firebaseURL, authFactory, $location, colorspaceFactory, imgProcessFactory, kmeansFactory, colorscaleFactory) {

    $scope.colorPicker = "#ffffff";

    $scope.palette = [];
    $scope.paletteName = "";
    $scope.clusterColors = null;
    $scope.saturationScale = null;
    $scope.complimentaryColor = null;
    $scope.imageUploaded = false;
    $scope.k = 3;

    $scope.searchTerm;
    $scope.searchImgResults;


    $scope.updateScales = function () {
      let hslcolorPicker = colorspaceFactory.RGB2HSL(colorspaceFactory.hexToRgb($scope.colorPicker));

      let hslSaturationScale = colorscaleFactory.saturationScaleHSL(hslcolorPicker, 0.1, 10);
      console.log("hslSaturationScale", hslSaturationScale);

      let rgbSaturationScale = hslSaturationScale.map((hslArr) => colorspaceFactory.hslToRgb(hslArr));

      // console.log("rgbSaturationScale", rgbSaturationScale);   
      let hexSaturationScale = rgbSaturationScale.map((rgbArr) => colorspaceFactory.rgbToHex(rgbArr));

      console.log("hexscale", hexSaturationScale);

      $scope.saturationScale = hexSaturationScale;    
    }


    $scope.compliment = function () {
      let rgbArr = colorspaceFactory.hexToRgb($scope.colorPicker);
      $scope.complimentaryColor = colorspaceFactory.rgbToHex(colorspaceFactory.compliment(rgbArr));
    }
    

    $scope.add = function (newColor) {
      //dont allow more than 8 colors in a palette
      if ($scope.palette.length >= 8){
        console.log("only 8 colors per palette allowed");
        return
      }
      //dont allow duplicate colors
      for (let color in $scope.palette){
        if (newColor === $scope.palette[color]){
          return;
        }
      }
      $scope.palette.push(newColor);
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



    $scope.deleteColor = function (hexStr) {
      // console.log("color to delete", color);
      let colorIdx = $scope.palette.indexOf(hexStr);
      if (colorIdx >= 0) {
        $scope.palette.splice(colorIdx, 1);
      }
      // $scope.$apply();
    }


    $scope.setColor = function (color) {
      $scope.colorPicker = color;
      $scope.updateScales();
      $scope.compliment();
    }




    let imageLoader = $('#imageLoader');

    imageLoader.change(handleImage);

    let canvas = $('#imageCanvas')[0];
    let ctx = canvas.getContext('2d');


    function handleImage(e){
      $scope.imageUploaded = true;
      $scope.$apply();
      var reader = new FileReader();
      reader.onload = function(event){
          var img = new Image();
          img.onload = function(){
              // canvas.width = img.width;
              // canvas.height = img.height;
              // ctx.drawImage(img,0,0);
              imgProcessFactory.fitImageOn(canvas, img, ctx);
          }
          img.src = event.target.result;
      }
      reader.readAsDataURL(e.target.files[0]);     
    }


    $scope.processImage = () => {
      console.log("processing");
      let points = imgProcessFactory.processImg(ctx);
      let k = parseInt($scope.k)

      let results = kmeansFactory.kmeans(points, k, 10);

      console.log("results", results);

      //convert the cluster centers from rgb arrays to hex values
      $scope.clusterColors = results.map((clusters) => colorspaceFactory.rgbToHex(clusters[0]))
    }

    $scope.flickrSearch = () => {
      console.log("searching flickr");

      let tags = $scope.searchTerm.replace(/\s/, ",");
      
      $http.get(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=411834a7e0dbf2349b1e95012621e5e2&tags=${tags}&format=json&nojsoncallback=1&per_page=20&media=photos`).then( (response) => {
          //data is an array of photo objects
          let data = response.data.photos.photo;

          $scope.searchImgResults = data.map((obj) => `https://farm${obj.farm}.staticflickr.com/${obj.server}/${obj.id}_${obj.secret}_m.jpg`);
          
        }, (error) => console.log("error", error))
    };

    $scope.analyze = function (imgSrc) {
      //https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
      console.log("imgSrc", imgSrc);
      var img = new Image();
      img.crossOrigin = "Anonymous";


      img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage( img, 0, 0 );
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

}

]);