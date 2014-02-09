'use strict';

describe('Controller: BadExampleCtrl', function () {

  // load the controller's module
  beforeEach(module('angularDataAccessApp'));

  var BadExampleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BadExampleCtrl = $controller('BadExampleCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
