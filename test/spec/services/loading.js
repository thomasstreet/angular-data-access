'use strict';

describe('Service: Loading', function () {

  // load the service's module
  beforeEach(module('angularDataAccessApp'));

  // instantiate service
  var Loading;
  beforeEach(inject(function (_Loading_) {
    Loading = _Loading_;
  }));

  it('should do something', function () {
    expect(!!Loading).toBe(true);
  });

});
