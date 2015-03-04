var buaaeatingFactorys = angular.module('buaaeatingFactorys', []);

buaaeatingFactorys.factory('Data', function() {
	var DishType = {
		createNew: function(dishId, name, price, content, img) {
			var dishType = {};

			dishType.dishId = dishId
			dishType.name = name
			dishType.price = parseInt(price)
			dishType.content = content
			dishType.img = img
			dishType.count = 0
			dishType.favor = "正常"
			dishType.temp = {
				opeVisible: false
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
			DishType.createNew("101", "红烧猪排盖饭", "15", "猪排+青菜+鸡蛋饼", "/waimai/assets/images/hongshaopaigu.jpg"),
			DishType.createNew("102", "香菇鸡丁盖饭", "15", "鸡块+香菇+鸡蛋饼", "/waimai/assets/images/xianggujiding.jpg"),
			DishType.createNew("103", "酱香排骨盖饭", "15", "排骨+土豆+鸡蛋饼", "/waimai/assets/images/jiangxiangpaigu.jpg"),
			DishType.createNew("104", "蒜苔炒肉盖饭", "13", "猪肉+蒜苔+鸡蛋饼", "/waimai/assets/images/suantaichaorou.jpg"),
			DishType.createNew("105", "香干炒肉盖饭", "13", "猪肉+香干+鸡蛋饼", "/waimai/assets/images/xiangganchaorou.jpg"),
			DishType.createNew("106", "土豆丝炒肉盖饭", "13", "猪肉+土豆丝+鸡蛋饼", "/waimai/assets/images/tudousi.jpg")
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
			discountCode: null,
			delTime: null,
			price: null
		}
	}
})

buaaeatingFactorys.factory('Service', function($http, Data, $localStorage) {
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

			if (deadlineDate < nowDate) {
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

	service.varifyDiscountCode = function(code, callback) {
		code += ""
		if (code.length === 6) {
			$http({
				url: "http://" + location.host + '/waimai/discount/get_discount',
				data: {
					"code": code
				},
				method: "POST"
			}).success(function(data) {
				if (typeof data.id !== "undefined") {
					// TO DO
					alert("恭喜优惠码验证成功~")
					$localStorage.orderInfo.discountCodeValid = true
				} else {
					alert("不好意思，没有找到这个验证码 :(")
					$localStorage.orderInfo.discountCodeValid = false
				}
				callback()
			});
		} else {
			$localStorage.orderInfo.discountCodeValid = false
			callback()
		}
	}

	service.submitOrder = function(callback) {
		//准备数据
		var dishes = [],
			drinks = [],
			orderInfo = $localStorage.orderInfo,
			reqData = {}

		// 获取订单有效项
		angular.forEach($localStorage.dishes, function(dish, index) {
			if (dish.count !== 0) {
				dishes.push(dish)
			}
		})
		angular.forEach($localStorage.drinks, function(drink, index) {
			if (drink.count !== 0) {
				drink = drink.name + "x" + drink.count
				drinks.push(drink)
			}
		})
		drinks = drinks.join(", ")

		// 组织数据
		reqData = {
			orderItems: dishes,
			drink: drinks,
			building: orderInfo.buildingNum,
			room: orderInfo.roomNum,
			phone: orderInfo.phoneNum,
			delTime: orderInfo.delTime,
			name: "测试微信号", // TO DO
			discount_type_new: 0, // TO DO
			discount_type_code: orderInfo.discountCodeValid ? 1 : 0
		}

		// 上传
		$http({
			url: "http://" + location.host + '/waimai/order/submit_order',
			data: reqData,
			method: "POST"
		}).success(function(ret) {
			console.log(ret)
			callback(ret)
		})
	}

	service.checkOrderInfo = function() {
		var orderInfoComplete = true,
			warnings = {
				buildingNum: "请填写公寓号~",
				roomNum: "请填写宿舍号~",
				phoneNum: "请填写手机号~",
				delTime: "请选择起送时间~"
			},
			alertWarning = ""

		// 验证菜品数量是否为零
		var noDishes = true
		angular.forEach($localStorage.dishes, function(dish, index) {
			if(dish.count !== 0){
				noDishes = false
			}
		})
		if(noDishes){
			alertWarning += "请至少预定一份餐品~" + "\n"
			orderInfoComplete = false
		}

		// 验证数据完整性
		angular.forEach($localStorage.orderInfo, function(item, index) {
			if((item === null || item === "") && index !== "discountCode"){
				alertWarning += warnings[index] + "\n"
				orderInfoComplete = false
			}
		})

		if(alertWarning !== ""){
			alert(alertWarning)
		}

		return orderInfoComplete
	}

	service.calculateSum = function(){
		var sum = 0

		angular.forEach($localStorage.dishes, function(dish){
			sum += dish.count * dish.price
		})
		angular.forEach($localStorage.drinks, function(drink){
			sum += drink.count * drink.price
		})

		// 优惠码
		if($localStorage.orderInfo.discountCodeValid){
			sum -= 2
		}

		// TODO 新用户

		// 检测最小值
		if(sum < 0){
			sum = 0
		}

		$localStorage.orderInfo.price = sum
		return sum
	}

	// 获取订单信息
	service.getOrderInfo = function(orderId, callback){
		// 上传
		$http({
			url: "http://" + location.host + '/waimai/order/query_order',
			params: {
				orderId:orderId
			},
			method: "GET"
		}).success(function(ret) {
			if(ret.status === "succeed"){
				callback(ret.data)
			} else{
				alert("不好意思，服务器出了点小问题，请稍后再试")
			}
		})
	}

	return service
})