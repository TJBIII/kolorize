"use strict";

describe('Page Controller', function() {
  beforeEach(module('Kolorize'));

  let $controller;

  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
  }));


  describe('setChosenPalette', function() {
    let $scope, controller;

    beforeEach(function() {
      $scope = {};
      controller = $controller('PageCtrl', {$scope: $scope});
    });

    it('should have a default chosen palette', function() {
      expect($scope.chosenPalette).toEqual({colors: [], name: ''})
    });

    it('should set the chosen palette to the palette passed in', function() {
      let p = {colors: ['#ffffff', '#badace'], name: 'My Palette'};
      $scope.setChosenPalette(p);
      expect($scope.chosenPalette).toEqual(p);
      expect($scope.chosenPalette).not.toEqual({colors: [], name: ''})
    });

    
  });

});