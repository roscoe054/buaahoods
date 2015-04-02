var buaaeatingCtrls = angular.module('buaaeatingCtrls', []);

buaaeatingCtrls.controller('reserveParentCtrl', function($scope, Data, Service, $localStorage) {
	// 本地缓存
	delete $localStorage.deltimes;
	
	$scope.$storage = $localStorage.$default({
		dishes: Data.dishes,
		drinks: Data.drinks,
		deltimes: Data.deltimes,
		userInfo: Data.userInfo, // 用户信息
		orderInfo: Data.orderInfo // 订单信息
	});

	// 顶部
	$scope.welcomeWords = "满4份送饮料!"

	// 网页入口获取微信昵称和是否是新用户
	var usernameNode = document.getElementById("userName"),
		newUserNode = document.getElementById("newUser")

	if(usernameNode){
		$localStorage.orderInfo.username = usernameNode.innerHTML
	}
	if(newUserNode){
		$localStorage.orderInfo.isNewUser = true
		$scope.welcomeWords = "新用户减2元!"
	}

	// JS 获取用户信息
	//Service.getUserNameFromWeixin()

	// 测试订单验证页
	//$scope.$storage.orderInfo.buildingNum = 1
	//$scope.$storage.orderInfo.roomNum = "中333"
	//$scope.$storage.orderInfo.phoneNum = 1501111111
})

buaaeatingCtrls.controller('ReserveCtrl', function($scope, Data, Service, $localStorage) {
	$scope.priceSum = Service.calculateSum()

	// 校验时间
	$scope.validDelTimes = Service.varifyDeltimes($scope.$storage.deltimes, false)

	if(typeof $scope.validDelTimes[0] !== "undefined"){
		$localStorage.orderInfo.delTime = $scope.delTime = $scope.validDelTimes[0].time
	} else{
		$localStorage.orderInfo.delTime = $scope.delTime = "none"
	}

	// 预订下拉
	$scope.reserveItem = function(dish){
		var opeVisible = dish.temp.opeVisible
		dish.temp.opeVisible = !opeVisible
	}

	// 改变口味
	$scope.changeFavor = function(dish, favorName){
		dish.favor = favorName
	}

	// 订单项事件处理
	$scope.addItemCount = function(item) {
		item.count += 1
		// 重新计算总价
		$scope.priceSum = Service.calculateSum()
	}
	$scope.subItemCount = function(item) {
		if (item.count > 0) {
			item.count -= 1
		}
		// 重新计算总价
		$scope.priceSum = Service.calculateSum()
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

	// 转到确认订单页
	$scope.confirmOrder = function() {
		var timeValid,orderInfoComplete

		Data.orderInfo.price = $scope.priceSum
		timeValid = Service.varifyDeltimes($scope.validDelTimes, true),
		orderInfoComplete = Service.checkOrderInfo()

		// 记录是由订餐页跳过去的
		$localStorage.$default({
			from: "reserve_page"
		});

		if(timeValid && orderInfoComplete){
			location.href = "#/order_confirm"
		}
	}

	// code改变时检测
	$scope.varifyDiscountCode = function(){
		Service.varifyDiscountCode($scope.$storage.orderInfo.discountCode, function(){
			// 重新计算总价
			$scope.priceSum = Service.calculateSum()
		})
	}

	$scope.updateTime = function(){
		$localStorage.orderInfo.delTime = $scope.delTime
	}
});

// 确认订单页
buaaeatingCtrls.controller('orderConfirmCtrl', function($scope, Service, $localStorage) {
	//mask
	$scope.maskVisible = false

	if(typeof $localStorage.from === "undefined"){
		location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx65cfe45c2c6fad4a&redirect_uri=http%3A%2F%2F182.92.107.59/buaaeating/reserve&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect"
	}

	$scope.submitOrder = function(){
		$scope.maskVisible = true

		// 最小加载延迟，防止加载框闪屏
		setTimeout(function(){
			Service.submitOrder(function(ret){
				if(ret.status === "succeed"){
					window.location.href = "#/order_succeed/" + ret.orderId
				}else{
					alert("不好意思，服务器出了点小问题，请稍后再试")
				}
				$scope.maskVisible = false
			})
		},300)
	}

	//drink num
	var drinksSum = 0
	$scope.noDrinks = false
	angular.forEach($localStorage.drinks, function(drink){
		drinksSum += drink.count
	})
	if(drinksSum === 0){
		$scope.noDrinks = true
	}
})

// 订单成功页
buaaeatingCtrls.controller('orderSucceedCtrl', function($scope, $localStorage, $routeParams, Service) {
	// 获取订单信息
	$scope.showDrinks = false

	Service.getOrderInfo($routeParams.orderId, function(retData){
		$scope.dishes = retData.dish
		$scope.drinks = []
		$scope.order = retData.order

		var orderStatus = {
			"-1": "订单已被取消，如有问题请联系我们",
			"0": "订单等待确认中",
			"1": "餐品准备中",
			"2": "餐品正在送来的路上"
		}
		$scope.orderStatus = orderStatus[retData.order.status]

		var drinksArr = retData.order.drink.split(", ")
		angular.forEach(drinksArr, function(drink){
			var drinkInfoArr = drink.split("x")

			$scope.drinks.push({
				name: drinkInfoArr[0],
				num:drinkInfoArr[1] === "" ? drinkInfoArr[1]: 1
			})
		})

		if(drinksArr[0] !== ""){
			$scope.showDrinks = true
		}
	})

	delete $localStorage.dishes;
	delete $localStorage.drinks;
	delete $localStorage.orderInfo;
	delete $localStorage.deltimes;
})
