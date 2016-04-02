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
    });

    
  });

});