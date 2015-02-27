var buaaeatingCtrls = angular.module('buaaeatingCtrls', []);

buaaeatingCtrls.controller('reserveParentCtrl', function($scope, Data, Service) {
	// header
	$scope.title = "订餐"

	// 共享数据
	$scope.dishes = Data.dishes
	$scope.drinks = Data.drinks
	$scope.deltimes = Data.deltimes
	$scope.orderInfo = Data.orderInfo // 订单信息

	// 测试订单验证页
	//$scope.dishes[0].count = 2
	//$scope.dishes[1].count = 2
	//$scope.drinks[0].count = 1
	$scope.orderInfo.buildingNum = 1
	$scope.orderInfo.roomNum = "中333"
	$scope.orderInfo.phoneNum = 1501111111
	$scope.orderInfo.price = 15
	$scope.orderInfo.delTime = "11:20"
})

buaaeatingCtrls.controller('ReserveCtrl', function($scope, Data, Service) {
	$scope.priceSum = Service.calculateSum()

	// 校验时间
	$scope.validDelTimes = Service.varifyDeltimes($scope.deltimes, false)
	$scope.delTime = Data.orderInfo.delTime = $scope.validDelTimes[0].time

	// 预订下拉
	$scope.reserveItem = function(dish){
		var opeVisible = dish.temp.opeVisible

		if(opeVisible){
			dish.temp.count = dish.count
		}
		dish.temp.opeVisible = !opeVisible
	}

	// 改变口味
	$scope.changeFavor = function(dish, favorName){
		dish.favor = favorName
	}

	// 订单项事件处理
	$scope.addItemCount = function(item) {
		item.temp.count += 1
	}
	$scope.subItemCount = function(item) {
		if (item.temp.count > 0) {
			item.temp.count -= 1
		}
	}
	$scope.addDrinkCount = function(drink) {
		drink.count += 1

		// 重新计算总价
		$scope.priceSum = Service.calculateSum()
	}
	$scope.subDrinkCount = function(drink) {
		if (drink.count > 0) {
			drink.count = 0
		}

		// 重新计算总价
		$scope.priceSum = Service.calculateSum()
	}

	$scope.itemConfirm = function(item) {
		item.count = item.temp.count
		item.temp.opeVisible = false

		// 上报需要检查时间是否有效
		Service.varifyDeltimes($scope.validDelTimes, false)

		// 重新计算总价
		$scope.priceSum = Service.calculateSum()
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
	$scope.varifyDiscountCode = function(){
		Service.varifyDiscountCode($scope.orderInfo.discountCode, function(){
			// 重新计算总价
			$scope.priceSum = Service.calculateSum()
		})
	}

});

// 确认订单页
buaaeatingCtrls.controller('orderConfirmCtrl', function($scope, Service) {
	$scope.submitOrder = function(){
		Service.submitOrder()
		window.location.href = "#/order_succeed"
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
