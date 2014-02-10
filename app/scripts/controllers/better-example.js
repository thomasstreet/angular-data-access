'use strict';

angular.module('angularDataAccessApp')
  .controller('BetterExampleCtrl', function ($scope, loading) {

    //Still need to pull this back from our
    //loading service somehow
    $scope.streetNames = [];
    
    //Wrap a call to the loading function in a scope-level
    //function that's accessible to our view
    $scope.streetNamesLoading = function(){
      return loading.isLoading('SFStreetNames');
    };

    //Kick off that loading call in our loading service
    loading.loadSFStreetNames();

  });
