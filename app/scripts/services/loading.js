'use strict';

angular.module('angularDataAccessApp')
  .factory('loading', function () {

    var _loadingStatus = {}

    var loading = {
      setLoadingStatus: function(field, status){
        _loadingStatus[field] = status;
      },
      getLoadingStatus: function(field){
        return _loadingStatus[field];
      },
      loadSFStreetNames: function(){
        loading.setLoadingStatus('SFStreetNames', true);
        var uri = 'http://data.sfgov.org/resource/6d9h-4u5v.json'

        var success = function(data, status, headers, config){
          //We can't access scope directly anymore
          //  $scope.streetNames = data;
          //  $scope.streetNamesLoading = false;

          //TODO:  We need to do something with this data!
          loading.setLoadingStatus('SFStreetNames', false);
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
