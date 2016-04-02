"use strict";

describe('Page Controller', function() {
  beforeEach(module('Kolorize'));

  let $controller;

  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
  }));


  describe('setChosenPalette function', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      controller = $controller('PageCtrl', {$scope: $scope});
    });

    it('should have a default chosen palette', function() {
      expect($scope.chosenPalette).toEqual({colors: [], name: ''})
    });

    it('should set the chosen palette to the palette passed in', function() {
      var p = {colors: ['#ffffff', '#badace'], name: 'My Palette'};
      $scope.setChosenPalette(p);
      expect($scope.chosenPalette).toEqual(p);
      expect($scope.chosenPalette).not.toEqual({colors: [], name: ''})
    });
  });

  describe('getLightness function', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      controller = $controller('PageCtrl', {$scope: $scope});
    });

    it('should return a number in the set [0,100]', function() {
      let randomHexs = ['#89557C', '#37F5DD', '#A0F5A6', '#85A763', '#80A781', '#51BA62', '#6AA5F7', '#3A82F2', '#9873FE', '#78E2F7', '#348FFF', '#269DB9', '#4F4C14', '#EBC6FB', '#463293'];

      randomHexs.forEach( (hex) => {
        let returnValue = $scope.getLightness('#b6dc00');
        expect(returnValue).toBeGreaterThan(-1);
        expect(returnValue).toBeLessThan(101);
      });
    });

    it('should return the correct Lightness value', function() {
      expect($scope.getLightness('#ffffff')).toBe(100);
      expect($scope.getLightness('#000000')).toBe(0);
      expect($scope.getLightness('#5497ff')).toBe(66);
      expect($scope.getLightness('#c77700')).toBe(39);
      expect($scope.getLightness('#2e1c00')).toBe(9);
    }); 
  });

  describe('delete color function', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      controller = $controller('PageCtrl', {$scope: $scope});
    });

    it('should remove only one color from chosenPalette', function() {
      $scope.chosenPalette.colors = ['#f64051','#3a5356','#98767c','#a18f5b'];
      expect($scope.chosenPalette.colors.length).toBe(4);
      $scope.deleteColor('#f64051');
      expect($scope.chosenPalette.colors.length).toBe(3);
    });

    it('should not do anything if the color to delete is not in the palette', function() {
      $scope.chosenPalette.colors = ['#f64051','#3a5356','#98767c','#a18f5b'];
      $scope.deleteColor('#ffffff');
      $scope.deleteColor('#63bfa8');
      expect($scope.chosenPalette.colors.length).toBe(4);
      expect($scope.chosenPalette.colors).toEqual(['#f64051','#3a5356','#98767c','#a18f5b']);
    });

    it('should preserve the order of the other colors', function() {
      $scope.chosenPalette.colors = ['#f64051','#3a5356','#98767c','#a18f5b'];
      $scope.deleteColor('#98767c');
      expect($scope.chosenPalette.colors).toEqual(['#f64051','#3a5356','#a18f5b']);
      $scope.deleteColor('#f64051');
      expect($scope.chosenPalette.colors).toEqual(['#3a5356','#a18f5b']);
    });
  });


});