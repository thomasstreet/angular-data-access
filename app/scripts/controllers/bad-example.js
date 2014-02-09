'use strict';

angular.module('angularDataAccessApp')
  .controller('BadExampleCtrl', function ($scope, $http) {
    //loading indicator variable
    $scope.streetNamesLoading = true;
    //scope variable of street names for binding to view
    $scope.streetNames = [];
    
    //Let's load some San Francisco street names
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
