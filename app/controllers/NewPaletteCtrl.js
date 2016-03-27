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

    $scope.colorPicker = "#badace";

    $scope.palette = [];
    $scope.paletteName = "";
    $scope.clusterColors;
    $scope.saturationScale = null;


    $scope.updateScales = function () {
      let hslcolorPicker = colorspaceFactory.RGB2HSL(colorspaceFactory.hexToRgb($scope.colorPicker));

      let hslSaturationScale = colorscaleFactory.saturationScaleHSL(hslcolorPicker, 0.1);
      console.log("hslSaturationScale", hslSaturationScale);

      let rgbSaturationScale = hslSaturationScale.map((hslArr) => colorspaceFactory.hslToRgb(hslArr));

      // console.log("rgbSaturationScale", rgbSaturationScale);   
      let hexSaturationScale = rgbSaturationScale.map((rgbArr) => colorspaceFactory.rgbToHex(rgbArr));

      $scope.saturationScale = hexSaturationScale;    
    }


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
              imgProcessFactory.fitImageOn(canvas, img, ctx);
          }
          img.src = event.target.result;
      }
      reader.readAsDataURL(e.target.files[0]);     
    }


    $scope.processImage = () => {
      let points = imgProcessFactory.processImg(ctx);

      let results = kmeansFactory.kmeans(points, 7, 10);

      console.log("results", results);

      //convert the cluster centers from rgb arrays to hex values
      $scope.clusterColors = results.map((clusters) => colorspaceFactory.rgbToHex(clusters[0]))

    }


  }

]);