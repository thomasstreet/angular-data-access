'use strict';

angular.module('angularDataAccessApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/bad-example', {
        templateUrl: 'views/bad-example.html',
        controller: 'BadExampleCtrl'
      })
      .when('/simple-good-example', {
        templateUrl: 'views/simple-good-example.html',
        controller: 'SimpleGoodExampleCtrl'
      })
      .when('/better-example', {
        templateUrl: 'views/better-example.html',
        controller: 'BetterExampleCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
