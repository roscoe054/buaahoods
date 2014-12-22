var buaaeatingApp = angular.module('buaaeatingApp',[
	'ngRoute','buaaeatingCtrls','ngTouch'
]);

buaaeatingApp.config(function($routeProvider){
	$routeProvider.when('order',{
		templateUrl: '/partials/reserve.html',
		controller: 'ReserveCtrl'
	}).otherwise({
		templateUrl: '/partials/reserve.html',
		controller: 'ReserveCtrl'
	})
})