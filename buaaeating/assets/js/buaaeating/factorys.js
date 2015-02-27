var buaaeatingFactorys = angular.module('buaaeatingFactorys', []);

buaaeatingFactorys.factory('Data', function() {
	var DishType = {
		createNew: function(name, price, content) {
			var dishType = {};

			dishType.name = name
			dishType.price = parseInt(price)
			dishType.content = content
			dishType.count = 0
			dishType.favor = "正常"
			dishType.temp = {
				opeVisible: false,
				count: 0
			}

			return dishType
		}
	}
	var DrinkType = {
		createNew: function(name) {
			var drinkType = {}

			if (name === "可乐" || name === "雪碧") {
				name += " / 听"
			}
			drinkType.name = name
			drinkType.price = 3
			drinkType.count = 0

			return drinkType
		}
	}

	return {
		dishes: [
			DishType.createNew("红烧猪排盖饭", "15", "猪排+青菜+鸡蛋饼"),
			DishType.createNew("香菇鸡丁盖饭", "15", "鸡块+香菇+鸡蛋饼"),
			DishType.createNew("酱香排骨盖饭", "15", "排骨+土豆+鸡蛋饼"),
			DishType.createNew("蒜苔炒肉盖饭", "13", "猪肉+蒜苔+鸡蛋饼"),
			DishType.createNew("香干炒肉盖饭", "13", "猪肉+香干+鸡蛋饼"),
			DishType.createNew("土豆丝炒肉盖饭", "13", "猪肉+土豆丝+鸡蛋饼")
		],
		drinks: [
			DrinkType.createNew("可乐"),
			DrinkType.createNew("雪碧"),
			DrinkType.createNew("冰红茶"),
			DrinkType.createNew("冰绿茶"),
			DrinkType.createNew("冰糖雪梨"),
			DrinkType.createNew("酸枣汁")
		],
		deltimes: [{
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
		}],
		orderInfo: {
			buildingNum: null,
			roomNum: null,
			phoneNum: null,
			discountCodeValid: false,
			delTime: null,
			price: null
		}
	}
})

buaaeatingFactorys.factory('Service', function($http, Data) {
	var service = {}

	service.varifyDeltimes = function(deltimes, testIfOverdue) {
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

	service.varifyDiscountCode = function(code) {
		code += ""
		if (code.length === 6) {
			$http({
				url: "http://" + location.host + '/discount/get_discount',
				data: {
					"code": code
				},
				method: "POST"
			}).success(function(data) {
				console.log(data)
				if (typeof data.id !== "undefined") {
					// TO DO
					alert("恭喜优惠码验证成功~")
					Data.orderInfo.discountCodeValid = true
				} else {
					alert("不好意思，没有找到这个验证码 :(")
					Data.orderInfo.discountCodeValid = false
				}
			});
		} else {
			Data.orderInfo.discountCodeValid = false
		}
	}

	service.submitOrder = function() {
		//准备数据
		var dishes = [],
			drinks = [],
			orderInfo = Data.orderInfo,
			reqData = {}

		// 获取订单有效项
		angular.forEach(Data.dishes, function(dish, index) {
			if (dish.count !== 0) {
				dishes.push(dish)
			}
		})
		angular.forEach(Data.drinks, function(drink, index) {
			if (drink.count !== 0) {
				drinks.push(drink)
			}
		})

		// 组织数据
		reqData = {
			orderItems: dishes,
			drink: drinks,
			building: orderInfo.buildingNum,
			room: orderInfo.roomNum,
			phone: orderInfo.phoneNum,
			price: orderInfo.price,
			delTime: orderInfo.delTime,
			name: "测试微信号", // TO DO
			discount_type_new: 0, // TO DO
			discount_type_code: orderInfo.discountCodeValid ? 1 : 0
		}

		// 上传
		$http({
			url: "http://" + location.host + '/order/submit_order',
			data: reqData,
			method: "POST"
		}).success(function(data) {
			console.log(data)
		})
	}

	service.checkOrderInfo = function() {
		// 验证数据完整性
		angular.forEach(Data.orderInfo, function(item, index) {
			if(item === null){
				alert("信息没有填写完整哦亲~")
				return false
			}
		})

		return true
	}

	return service
})