var buaaeatingCtrls = angular.module('buaaeatingCtrls', ['ngTouch']);

buaaeatingCtrls.controller('reserveParentCtrl', function($scope, Data, Service) {
	/**
	 *	共享数据
	 */
	$scope.dishes = Data.dishes
	$scope.drinks = Data.drinks
	$scope.deltimes = Data.deltimes
	$scope.orderInfo = Data.orderInfo // 订单信息

	// 测试订单验证页
	$scope.dishes[0].count = 2
	$scope.dishes[1].count = 2
	$scope.drinks[0].count = 1
})

buaaeatingCtrls.controller('ReserveCtrl', function($scope, $http, Data, Service) {
	$scope.priceSum = 0

	// 校验时间
	$scope.validDelTimes = Service.varifyDeltimes($scope.deltimes, false)
	$scope.delTime = $scope.validDelTimes[0].time

	/**
	 *	事件处理
	 */
	// operate handlers
	$scope.addItemCount = function(item) {
		item.count += 1
		$scope.priceSum += item.price

		// 上报需要检查时间是否有效
		Service.varifyDeltimes($scope.validDelTimes, false)
	}

	$scope.subItemCount = function(item) {
		if (item.count > 0) {
			item.count -= 1
			$scope.priceSum -= item.price
		}
	}

	// submit
	$scope.submitOrder = function() {
		// 上报需要检查时间是否有效
		Service.varifyDeltimes($scope.validDelTimes, true)
	}

	// discount
	$scope.varifyDiscountCode = function(){
		Service.varifyDiscountCode($scope.orderInfo.discountCode)
	}
});

// 确认订单页
buaaeatingCtrls.controller('orderConfirmCtrl', function($scope, Data) {
})

// 页面准备好了
function ReserveCtrlReady($scope) {
	angular.element(document).ready(function() {
		var host = location.host
	});
}
