Organizing Data Access in AngularJS
===================================

While building an AngularJS app with any sort of server access, you have probably leveraged asynchronous requests and callbacks throughout your code.  For me, the approach has often been:

>  "Oh, I need to get this data from an HTTP API, so let me drop in an `$http.get` right here in my controller, write up a callback that binds the data to a variable in my `$scope` object, maybe wire up a variable to use as a loading indicator, and boom--my UI is updated and I'm happy with my life.  Oh, and I ~~probably won't~~ might write some error-handling logic for this at some point."

Or more concretely, here's some code for a controller doing exactly that: 

`app/scripts/controllers/bad-example.js`
```javascript
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
```

And the corresponding view: 

`app/views/bad-example.html`
```html
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
```


Does that look familiar?  This approach works on the quick, but it sure doesn't scale.  What about when you need to use that data in a different controller?  What about if you need to refactor your data sources to use different URIs or to follow a different schema?  As your application grows, this gets messy, and 'messy' isn't conducive to building quality software.  We need to organize this better.  Fortunately, AngularJS has tools we can leverage to this end.

Enter **Angular services.**  Services in Angular let you share logic between different modules in your code.  In this case, we can create a single service, which we can call `loading` and that we can load into as many different controllers as we need.

I'm using Yeoman here (which is amazing,) so to create my loading service I'm just going to run `yo angular:factory loading` at the command-line and Yeoman will create my boiler-plate file for me, as well as load it into index.html.  If you haven't set up Yeoman, you can just create the file manually and include the script in index.html yourself.

We can now include this "loading" service by dependency-injecting it into our controller (that is, include "loading" as one of the parameters in the controller declaration)


Starting out `app/scripts/controllers/better-example.js`
```javascript
angular.module('angularDataAccessApp')
  //Dependency-inject the 'loading' service here
  .controller('BetterExampleCtrl', function ($scope, loading) {
    //TODO:  write some logic making use of 'loading'
  });
```

Now what are we going to make loading do, exactly?  There are two roles I'd like it to fulfill.

 1. Primarily, load data asynchronously and do something sane with it (our goal again is nice, clean organization.)
 2. Secondarily, give us access to loading indicators so we can update our UI consistently

Let's start with #1.  Let's load the data with a variant on the code we had in our bad-example controller.  I'll add a "loadSFStreetNames" function to the loading service and plug in pretty much the same logic.  We still have to do something with that data once we have it, though.

`app/scripts/services/loading.js`
```javascript
angular.module('angularDataAccessApp')
  .factory('loading', function () {

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
```


So if we call `loading.loadSFStreetNames()` from our controller, we're going to hit this function and make the async request, but we need to have a way to bring that data back to our controller.

We could store the data in our `loading` service, but it feels cleaner to me to separate the concerns of loading and storage, so I'm going to spin up another service, `data`.  I'll run `yo angular:factory data` and then dependency-inject `data` into our `loading` service.  `data` will be our data storage container, while `loading` is the workhorse that runs and fetches the data as well as keeping track of loading status.

