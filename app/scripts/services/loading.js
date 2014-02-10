'use strict';

angular.module('angularDataAccessApp')
  .factory('loading', function (data, $http) {

    //private hash for keeping track of loading values (true/false)
    //for a given key
    var _loadingStatus = {};

    var loading = {

      //accessor/mutator methods for the loading hash
      setLoading: function(field, value){
        _loadingStatus[field] = value;
      },
      isLoading: function(field){
        return _loadingStatus[field];
      },


      loadSFStreetNames: function(){
        var uri = 'http://data.sfgov.org/resource/6d9h-4u5v.json'

        var success = function(data, status, headers, config){
          //We can't access scope directly anymore
          //  $scope.streetNames = data;
          //  $scope.streetNamesLoading = false;

          //TODO:  We need to do something with this data!
          loading.setLoading('SFStreetNames', false);
        };

        var error = function(data, status, headers, config){
          //TODO:  write some error-handling logic, maybe? 
        };

        loading.setLoading('SFStreetNames', true);
        $http.get(uri)
          .success(success)
          .error(error)
      }
    };

    return loading;
  });
