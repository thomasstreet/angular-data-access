'use strict';

angular.module('angularDataAccessApp')
  .controller('BadExampleCtrl', function ($scope, $http) {
    $scope.streetNamesLoading = true;
    $scope.streetNames = [];
    
    var uri = 'http://data.sfgov.org/resource/6d9h-4u5v.json'
    $http.get(uri)
      .success(function(data, status, headers, config){
        $scope.streetNames = data;
        $scope.streetNamesLoading = false;
      })
      .error(function(data, status, headers, config){
        //TODO:  write some error-handling logic, maybe? 
      })
  });
