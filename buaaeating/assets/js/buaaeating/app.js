var buaaeatingApp = angular.module('buaaeatingApp',[
	'ngRoute','ngTouch','buaaeatingCtrls','buaaeatingFilters','buaaeatingFactorys'
]);

var rootPath = '/partials/buaaeating/'

buaaeatingApp.config(function($routeProvider){
	$routeProvider.when('/order_confirm',{
		templateUrl: rootPath + 'order_confirm.html',
		controller: 'orderConfirmCtrl'
	}).otherwise({
		templateUrl: rootPath + 'reserve.html',
		controller: 'ReserveCtrl'
	})
})