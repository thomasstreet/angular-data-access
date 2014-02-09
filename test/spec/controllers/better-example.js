'use strict';

describe('Controller: BetterExampleCtrl', function () {

  // load the controller's module
  beforeEach(module('angularDataAccessApp'));

  var BetterExampleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BetterExampleCtrl = $controller('BetterExampleCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
