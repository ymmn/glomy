'use strict';

angular.module('glomyApp')
  .controller('MainCtrl', [
	'$scope',
	'$cookies',
	'$rootScope',
	'$filter',
	'$firebase',
	function ($scope, $cookies, $rootScope, $filter, $firebase) {
	  var fbBaseUrl = "https://ymn.firebaseio.com/glomy/";

	  /*************** Login *************/
	  $scope.login = function() {
		$cookies.username = $scope.username;
		$rootScope.current_user = $scope.username;
	  }

	  $rootScope.$watch('current_user', function(nval, oldval) {
		if( nval !== undefined ) {
		  var fbRef = new Firebase(fbBaseUrl + $scope.current_user)
		  $scope.goals = $firebase(fbRef);
		}
	  });

	  /************** Goal index ***********/
	  $scope.createGoal = function() {
		var initData = {};
		initData[new Date()] = 0;
		var newGoal = {}; 
		newGoal[$scope.new_goal_name] = {
		  data: initData,
		  per_day: $scope.goal_per_day
		};
		$scope.goals.$add(newGoal);
		$scope.new_goal_name = "";
		$scope.goal_per_day = "";
	  }

	  $scope.getGoalName = function(goal) {
		return Object.keys(goal)[0];
	  }


	  /************** Goal Detail ************/
	  $scope.openGoal = function(goal) {
		$rootScope.current_goal = goal;	
		$scope.goal_name = Object.keys(goal)[0];
		$scope.goal_data = goal[$scope.goal_name].data;
		var totalCnt = 0;
		for(var dt in $scope.goal_data) {
		  totalCnt += $scope.goal_data[dt];
		}
		$scope.count = totalCnt;
		initGami();
	  }

	  $scope.format_dtime = function(dt) {
		return $filter('date')(new Date(dt), 'MM/dd');
	  }

	  $scope.addToCount = function() {
		$scope.goal_data[new Date()] = $scope.new_count;
		$scope.count += $scope.new_count;
		$scope.goals.$save();
		updateGami();
		$scope.new_count = "";
	  }

	  /************ Gamified ***********/
	  $scope.show_gamified = true;

	  var initExpTable = function(endGoal) {
		var arr = [];
		var maxVal = 0;
		for(var i = 0; i < 100; i++) {
		  var val = 0.000001*Math.pow(i, 7) + 500*Math.pow(i,2) + 15000*Math.pow(i,1);
		  arr.push( val );   
		  maxVal = val;
		}
		var scale = endGoal / maxVal;
		return arr.map(function(a) { return Math.round( a * scale ); });
	  }

	  var expTable;

	  var getLevel = function(cnt) {
		for(var res = 0; res < expTable.length; res++) {
		  if( expTable[res] > cnt ) return res;
		}
		return expTable.length;
	  }

	  var getNextLevelCnt = function(curLevel) {
		var expDelta = expTable[curLevel] - $scope.count;
		return expDelta;
	  }

	  var updateGami = function() {
		$scope.level = getLevel($scope.count);
		$scope.nextLevelAt = getNextLevelCnt($scope.level);
	  }

	  var initGami = function() {
		expTable = initExpTable(3650 * $rootScope.current_goal[$scope.goal_name].per_day);
		updateGami();
	  }

	}
  ]);
