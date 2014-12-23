var buaaeatingCtrls = angular.module('buaaeatingCtrls', ['ngTouch']);

buaaeatingCtrls.controller('reserveParentCtrl', function($scope) {
	/**
	 *	准备视图数据
	 */
	var DishType = {
		createNew: function(name, price, content) {
			var dishType = {};

			dishType.name = name
			dishType.price = parseInt(price)
			dishType.content = content
			dishType.count = 0

			return dishType
		}
	};
	$scope.dishes = [
		DishType.createNew("红烧猪排盖饭", "15", "+猪排+青菜+鸡蛋饼"),
		DishType.createNew("酱香排骨盖饭", "15", "+排骨+土豆块+鸡蛋饼"),
		DishType.createNew("香菇鸡丁盖饭", "15", "+鸡块+香菇+鸡蛋饼"),
		DishType.createNew("蒜苔炒肉盖饭", "13", "+猪肉+蒜苔+鸡蛋饼"),
		DishType.createNew("香干炒肉盖饭", "13", "+猪肉+香干+鸡蛋饼"),
		DishType.createNew("土豆丝炒肉盖饭", "13", "+猪肉+土豆丝+鸡蛋饼")
	];

	var DrinkType = {
		createNew: function(name) {
			var drinkType = {}

			if (name === "可乐" || name === "雪碧") {
				name += "/听"
			}
			drinkType.name = name
			drinkType.price = 3
			drinkType.count = 0

			return drinkType
		}
	};
	$scope.drinks = [
		DrinkType.createNew("可乐"),
		DrinkType.createNew("雪碧"),
		DrinkType.createNew("冰红茶"),
		DrinkType.createNew("冰绿茶"),
		DrinkType.createNew("冰糖雪梨"),
		DrinkType.createNew("酸枣汁")
	]

	// 订餐时间
	$scope.deltimes = [{
		time: "11:20",
		reserveDeadline: "11:00",
		valid: true
	}, {
		time: "12:00",
		reserveDeadline: "11:30",
		valid: true
	}, {
		time: "17:30",
		reserveDeadline: "17:00",
		valid: true
	}, {
		time: "21:50",
		reserveDeadline: "21:30",
		valid: true
	}]

	// 校验时间
	$scope.validDelTimes = varifyDeltimes($scope.deltimes, false)

	// 订单信息
	$scope.orderInfo = {
		buildingNum: null,
		roomNum: null,
		phoneNum: null,
		discountCode : null,
		discountCodeValid: false,
		delTime: $scope.validDelTimes[0].time
	}

	// 测试订单验证页
	$scope.dishes[0].count = 2
	$scope.dishes[1].count = 2
	$scope.drinks[0].count = 1

	// 监听
	$scope.$on("checkTimeValid", function(event, testIfOverdue) {
		$scope.validDelTimes = varifyDeltimes($scope.deltimes, testIfOverdue)
	});
	$scope.$on("checkCodeValid", function(event, ifCodeValid) {
		$scope.orderInfo.discountCodeValid = ifCodeValid
	});

})

buaaeatingCtrls.controller('ReserveCtrl', function($scope, $http) {
	$scope.priceSum = 0

	/**
	 *	事件处理
	 */
	// operate handlers
	$scope.addItemCount = function(item) {
		item.count += 1
		$scope.priceSum += item.price

		// 上报需要检查时间是否有效
		$scope.$emit("checkTimeValid", false)
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
		$scope.$emit("checkTimeValid", true)
	}

	// discount
	$scope.varifyDiscountCode = function(code) {
		code += ""
		if (code.length === 6) {
			$http({
				url: "http://" + location.host + '/discount/get_discount',
				params: {
					"code": code
				},
				method: "GET",
			}).success(function(data) {
				if (typeof data.id !== "undefined") {
					// TO DO
					alert("恭喜优惠码验证成功~")
					$scope.$emit("checkCodeValid", true)
				} else {
					alert("不好意思，没有找到这个验证码 :(")
					$scope.$emit("checkCodeValid", false)
				}
			});
		} else{
			$scope.$emit("checkCodeValid", false)
		}
	}
});

// 确认订单页
buaaeatingCtrls.controller('orderConfirmCtrl', function($scope, $http) {

})

function varifyDeltimes(deltimes, testIfOverdue) {
	var validDelTimes = []

	for (var i in deltimes) {
		var deltime = deltimes[i],
			deadline = deltime.reserveDeadline,
			nowDate = new Date(),
			deadlineDate = new Date()

		deadlineDate.setHours(parseInt(deadline.slice(0, 2)))
		deadlineDate.setMinutes(parseInt(deadline.slice(3, 5)))

		if (deadlineDate < nowDate && deltime.valid) {
			if (testIfOverdue) {
				alert("不好意思，页面放太久失效了，请刷新一下吧~")
			}
			deltime.valid = false
		} else {
			validDelTimes.push(deltime)
		}
	}

	return validDelTimes
}

// 页面准备好了
function ReserveCtrlReady($scope) {
	angular.element(document).ready(function() {
		var host = location.host
	});
}