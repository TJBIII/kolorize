"use strict";

describe('Color Controller', function() {
  beforeEach(module('Kolorize'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
  }));


  describe('compliment color', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      $scope.chosenPalette = {colors: [], name: 'Test'};
      controller = $controller('ColorCtrl', {$scope: $scope});
    });

    it('should update the complimentaryColor variable', function() {
      expect($scope.compliment).toBeDefined();
      $scope.colorPicker = '#90cfff';
      $scope.compliment();
      expect($scope.complimentaryColor).toBe('#ffbf8f');
      expect($scope.complimentaryColor).not.toBe('#ffffff');

      //white is it's own compliment color
      $scope.colorPicker = '#ffffff';
      $scope.compliment();
      expect($scope.complimentaryColor).toBe('#ffffff');
    });

  });

  describe('saturation scale', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      $scope.chosenPalette = {colors: [], name: 'Test'};
      controller = $controller('ColorCtrl', {$scope: $scope});
    });

    it('should have a getSaturationScale function', function() {
      expect($scope.updateScales).toBeDefined();
      $scope.colorPicker = '#e84653';
      $scope.updateScales();
      expect($scope.saturationScale.length).toBeLessThan(11);
      expect($scope.saturationScale[2]).toBe('#d85661');
      expect($scope.saturationScale[7]).toBe('#af7f83');
    });
  });


  describe('add color', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      $scope.chosenPalette = {colors: [], name: 'Test'};
      controller = $controller('ColorCtrl', {$scope: $scope});
    });


    it('should add a color to the end of the colors array', function() {
      $scope.add('#98f23d');
      expect($scope.colors.length).toBe(1);

      $scope.add('#ffffff');
      $scope.add('#badace');
      expect($scope.colors.length).toBe(3);
      expect($scope.colors[$scope.colors.length - 1]).toBe('#badace');
    });


    it('should not allow more than 8 colors in the colors array', function() {
      //add in 8 colors (max amount)
      let colors = ['#ffffff', '#121212', '#ef34fc', '#badace', '#efefef', '#a3e789', '#000000', '#e6e6e6'];

      colors.forEach( (color) => $scope.add(color));

      expect($scope.colors.length).toBe(8);
      $scope.add('#65cd8a');
      expect($scope.colors.length).toBe(8);
    });


    it('should not allow duplicate colors', function() {
      $scope.add('#ffffff');
      $scope.add('#33ef2a');
      expect($scope.colors.length).toBe(2);

      //duplicates should not be added
      $scope.add('#33ef2a');
      expect($scope.colors.length).toBe(2);
      $scope.add('#ffffff');
      expect($scope.colors.length).toBe(2);
    });

  });


  
});