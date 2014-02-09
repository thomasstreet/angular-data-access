Organizing Data Access in AngularJS
===================================

While building an AngularJS app with any sort of server access, you have probably leveraged asynchronous requests and callbacks throughout your code.  For me, the approach has often been:

>  "Oh, I need to get this data from an HTTP API, so let me drop in an `$http.get` right here in my controller, write up a callback that binds the data to a variable in my `$scope` object, maybe wire up a variable to use as a loading indicator, and boom--my UI is updated and I'm happy with my life.  Oh, and I ~~probably won't~~ might write some error-handling logic for this at some point."

Or more concretely, here's some code for a controller doing exactly that:


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

And the corresponding view:

    <h2>San Francisco Street Names</h2>
    <ul>
      <li ng-repeat="street in streetNames"
          ng-show="!streetNamesLoading" >
        {{street["fullstreetname"]}}
      </li>
    </ul>
    <p ng-show="streetNamesLoading">
      Street names are loading.
    </p>


Does that look familiar?  This approach works on the quick, but it sure doesn't scale.  What about when you need to use that data in a different controller?  What about if you need to refactor your data sources to use different URIs or to follow a different schema?  This gets messy, and 'messy' isn't conducive to building quality software.  We need to organize this better.  Fortunately, AngularJS has tools we can leverage to this end.

Enter an angular service.  Services in angular give you 