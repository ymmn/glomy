'use strict';

angular.module('glomyApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'firebase'
])
  .config(function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

	  $httpProvider.interceptors.push(function($q, $rootScope) {
		  return {
			  'request': function(config) {
				  $rootScope.$broadcast('loading-started');
				  return config || $q.when(config);
			  },
			  'response': function(response) {
				  $rootScope.$broadcast('loading-complete');
				  return response || $q.when(response);
			  }
		  };
	  });

  })
  .directive("loadingIndicator", function() {
	return {
	  restrict : "A",
	  template: "<i class='fa fa-refresh fa-spin'></i>",
	  link : function(scope, element, attrs) {
		  scope.$on("loading-started", function(e) {
			  alert("start");
			  element.css({"display" : ""});
		  });

		  scope.$on("loading-complete", function(e) {
			  alert("done");
			  element.css({"display" : "none"});
		  });

	  }
	};
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

	  $scope.gotoHome = function() {
		$rootScope.current_goal = undefined;
	  }

	  $rootScope.current_user = $cookies.username;
	}
  ]);
