var buaaeatingCtrls = angular.module('buaaeatingCtrls', ['ngTouch']);

buaaeatingCtrls.controller('ReserveCtrl', function($scope, $http) {
	// data structure
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

	$scope.priceSum = 0

	// operate handlers
	$scope.addItemCount = function(item) {
		item.count += 1
		$scope.priceSum += item.price
		varifyDeltimes($scope.deltimes, false)
	}

	$scope.subItemCount = function(item) {
		if (item.count > 0) {
			item.count -= 1
			$scope.priceSum -= item.price
		}
	}

	// submit
	$scope.submitOrder = function() {
		varifyDeltimes($scope.deltimes, true)
	}

	// discount
	$scope.discountCode = ""
	$scope.varifyDiscountCode = function(code) {
		code += ""
		if(code.length === 6){
			$http({
				url: "http://" + location.host + '/discount/get_discount',
				params: {"code":code},
				method: "GET",
			}).success(function(data) {
				console.log(data)
				if(typeof data.id !== "undefined"){
					// TO DO
					console.log('success')
				} else{
					console.log('fail')
				}
			});
		}
	}

	/**
	*	页面执行部分
	*/
	varifyDeltimes($scope.deltimes, false)
});

function varifyDeltimes(deltimes, testIfOverdue) {
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
		}
	}
}

// 页面准备好了
function ReserveCtrlReady($scope) {
	angular.element(document).ready(function() {
		var host = location.host
	});
}