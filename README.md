Organizing Data Access in AngularJS
===================================

##What's happening here?

This article will demonstrate (by building!) a pattern for an AngularJS application that encourages clean separation of concerns between data access, storage, and presentation.  For a reader familiar with MVC or *n*-tier architectural patterns, the concepts in this article should look familiar.

Since Angular doesn't quite fit neatly into either of those molds, though, the pattern demonstrated here takes some of the successful concepts from both architectural styles and brings them to work in Angular.  The result is a highly organized, time-saving, easily refactorable, and scalable pattern for managing data access in AngularJS.




##The problem

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

[Bad arch diagram]


Does that look familiar?  This approach works on the quick, but it sure doesn't scale.  What about when you need to use that data in a different controller?  What about if you need to refactor your data sources to use different URIs or to follow a different schema?  As your application grows, this gets messy, and 'messy' isn't conducive to building quality software.  We need to organize this better.  Fortunately, AngularJS has tools we can leverage to this end.




###Building a `loading` service to fetch and track our data

Enter **Angular services.**  Services in Angular let you share logic between different modules in your code.  In this case, we can create a single service, which we can call `loading` and that we can load into as many different controllers as we need.

I'm using Yeoman here (which is amazing,) so to create my loading service I'm just going to run `yo angular:factory loading` at the command-line and Yeoman will create my boiler-plate file for me, as well as load it into index.html.  If you haven't set up Yeoman, you can just create the file manually and include the script in index.html yourself.

*Note that I'm using the word 'service' interchangably with 'factory' here.  While a distinction exists between Angular's services, providers, and factories, they can all be used for the same main purpose, and it seems that 'service' is the common way to refer to the lot of them conceptually*

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

Let's start with #1.  Let's load the data with a variant on the code we had in our bad-example controller.  I'll add a `loadSFStreetNames` function to the loading service and plug in pretty much the same logic.  We still have to do something with that data once we have it, though.

`app/scripts/services/loading.js`
```javascript
angular.module('angularDataAccessApp')
  .factory('loading', function ($http) {

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

So if we call `loading.loadSFStreetNames()` from our controller, we're going to hit this function and make the async request--but since we can't work directly with that controller's scope anymore, we need to have a way to bring that data back to our controller.  We'll get to that in a second.  Let's handle the loading indicators first, while we're here.

Our UI needs to know about the loading status of this request, so that we can show the users some sort of loading progress bar or loading text or apology or whatever it is you want to show them.  The only place that knows about the status of this async request is this service itself, so we're going to need to create a way to pass that status on back to the controller.  Let's build out a few methods!

```diff
angular.module('angularDataAccessApp')
  .factory('loading', function ($http) {

+   //private hash for keeping track of loading values (true/false)
+   //for a given key
+   var _loadingStatus = {};

    var loading = {

+     //accessor/mutator methods for the loading hash
+     setLoading: function(field, value){
+      _loadingStatus[field] = value;
+     },
+     isLoading: function(field){
+       return _loadingStatus[field];
+     },


      loadSFStreetNames: function(){
        var uri = 'http://data.sfgov.org/resource/6d9h-4u5v.json'

        var success = function(data, status, headers, config){
          //We can't access scope directly anymore
          //  $scope.streetNames = data;
          //  $scope.streetNamesLoading = false;

          //TODO:  We need to do something with this data!
+         loading.setLoading('SFStreetNames', false);
        };

        var error = function(data, status, headers, config){
          //TODO:  write some error-handling logic, maybe? 
        };

+       loading.setLoading('SFStreetNames', true);
        $http.get(uri)
          .success(success)
          .error(error)
      }
    };

    return loading;
  });
```

So now we update a flag saying "this field is loading!" (`true`) before we start loading things and flip it back to "this field is NOT loading!" (`false`) once loading is complete.  In our controller, if we call `loading.isLoading('SFStreetNames')`, we'll get the status we're looking for.  We can wire that up to an `ng-show` in our view, and boom, we've got a loading indicator.

Note that we're wrapping our loading check into another function in our controller so that we are ensured that we're pointing to a *reference* to our data rather than just evaluating once to a primitive value.  


Controller:
`app/scripts/controllers/better-example.js`
```javascript
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
```

And view:
`app/views/better-example.html`
```html
<h2>San Francisco Street Names</h2>
<ul>
  <li ng-repeat="street in streetNames"
      ng-show="!streetNamesLoading()" >
    {{street["fullstreetname"]}}
  </li>
</ul>
<p ng-show="streetNamesLoading()">
  Street names are loading.
</p>
```

Alright!  Our loading service is now almost done with its tasks:  it's faithfully fetching data and it's keeping a ledger of loading statuses--now we just need to manage getting that data the rest of the way back to our controller(s).  Time to add another player.

[Arch diagram here]




###Building a `data` service to store our data

We could store the data in our `loading` service, but it's cleaner to separate the concerns of loading and storage--there are times we may want to kick off loading data without immediately accessing it, and there are times when we won't need to load data asynchronously if we've already stored it once.  Since these are distinct purposes, I'm going to spin up another service, `data`.  I'll run `yo angular:factory data` and then dependency-inject `data` into our `loading` service.  `data` will be our data storage container, while `loading` is the workhorse that runs and fetches the data as well as keeping track of loading status.

[Arch diagram here]

