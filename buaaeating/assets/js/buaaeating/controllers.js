var buaaeatingCtrls = angular.module('buaaeatingCtrls', []);

buaaeatingCtrls.controller('reserveParentCtrl', function($scope, Data, Service) {
	// 共享数据
	$scope.dishes = Data.dishes
	$scope.drinks = Data.drinks
	$scope.deltimes = Data.deltimes
	$scope.orderInfo = Data.orderInfo // 订单信息

	// 测试订单验证页
	$scope.dishes[0].count = 2
	$scope.dishes[1].count = 2
	$scope.drinks[0].count = 1
	$scope.orderInfo.buildingNum = 1
	$scope.orderInfo.roomNum = "中333"
	$scope.orderInfo.phoneNum = 1501111111
	$scope.orderInfo.price = 15
	$scope.orderInfo.delTime = "11:20"
})

buaaeatingCtrls.controller('ReserveCtrl', function($scope, Data, Service) {
	$scope.priceSum = 0

	// 校验时间
	$scope.validDelTimes = Service.varifyDeltimes($scope.deltimes, false)
	$scope.delTime = Data.orderInfo.delTime = $scope.validDelTimes[0].time

	// 订单项事件处理
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

	// 转到确认订单页
	$scope.confirmOrder = function() {
		var timeValid,orderInfoComplete

		Data.orderInfo.price = $scope.priceSum
		timeValid = Service.varifyDeltimes($scope.validDelTimes, true),
		orderInfoComplete = Service.checkOrderInfo()
		
		if(timeValid && orderInfoComplete){
			location.href = "#/order_confirm"
		}
	}

	// code改变时检测
	$scope.discountCode = null
	$scope.varifyDiscountCode = function(){
		Service.varifyDiscountCode($scope.discountCode)
	}

});

// 确认订单页
buaaeatingCtrls.controller('orderConfirmCtrl', function($scope, Service) {
	$scope.submitOrder = function(){
		Service.submitOrder()
	}
})

// 订单成功页
buaaeatingCtrls.controller('orderSucceedCtrl', function($scope) {
	
})

// 页面准备好了
function ReserveCtrlReady($scope) {
	angular.element(document).ready(function() {
		var host = location.host
	});
}
