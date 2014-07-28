'use strict';

angular.module('glomyApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'firebase'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .controller('NavCtrl', [
	'$cookies',
	'$rootScope',
	'$scope',
	function($cookies, $rootScope, $scope) {
	  $scope.logout = function() {
		$rootScope.current_user = undefined;
		$cookies.username = undefined;
	  }

	  $rootScope.current_user = $cookies.username;
	}
  ]);
