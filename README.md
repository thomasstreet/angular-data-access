Organizing Data Access in AngularJS
===================================

While building an AngularJS app with any sort of server access, you have probably leveraged asynchronous requests and callbacks throughout your code.  For me, the approach has often been:

>  "Oh, I need to get this data from an HTTP API, so let me drop in an `$http.get` right here in my controller, write up a callback that binds the data to a variable in my `$scope` object, maybe wire up a variable to use as a loading indicator, and boom--my UI is updated and I'm happy with my life.  Oh, and I ~~probably wont~~ might write some error-handling logic for this at some point, when I get around to it."

Does that look familiar?  This approach works on the quick, but it sure doesn't scale.  What about when you need to 