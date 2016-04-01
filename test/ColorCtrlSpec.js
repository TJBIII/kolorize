describe('Color Controller', function() {
  beforeEach(module('Kolorize'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
  }));


  describe('$scope.compliment', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      $scope.chosenPalette = {colors: [], name: 'Test'};
      controller = $controller('ColorCtrl', {$scope: $scope});
    });

    it('should have a compliment color function', function() {
      expect($scope.compliment).toBeDefined();
    });

  });
});