var buaaeatingApp = angular.module('buaaeatingApp',[
	'ngRoute','buaaeatingCtrls','ngTouch'
]);

buaaeatingApp.config(function($routeProvider){
	$routeProvider.when('order',{
		templateUrl: 'reserve.html',
		controller: 'ReserveCtrl'
	}).otherwise({
		templateUrl: 'views/reserve.html',
		controller: 'ReserveCtrl'
	})
})