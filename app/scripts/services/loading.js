'use strict';

angular.module('angularDataAccessApp')
  .factory('loading', function (data) {

    var loading = {
      loadSFStreetNames: function(){
        var uri = 'http://data.sfgov.org/resource/6d9h-4u5v.json'

        var success = function(data, status, headers, config){
          //We can't access scope directly anymore
          //  $scope.streetNames = data;
          //  $scope.streetNamesLoading = false;

          //TODO:  We need to do something with this data!
        };

        var error = function(data, status, headers, config){
          //TODO:  write some error-handling logic, maybe? 
        };

        $http.get(uri)
          .success(success)
          .error(error)
      }
    };

    return loading;
  });
