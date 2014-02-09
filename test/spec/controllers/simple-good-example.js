'use strict';

describe('Controller: SimpleGoodExampleCtrl', function () {

  // load the controller's module
  beforeEach(module('angularDataAccessApp'));

  var SimpleGoodExampleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SimpleGoodExampleCtrl = $controller('SimpleGoodExampleCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
