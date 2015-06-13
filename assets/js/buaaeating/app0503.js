var buaaeatingApp = angular.module('buaaeatingApp',[
	'ngRoute','ngTouch','ngStorage','buaaeatingCtrls','buaaeatingFilters','buaaeatingFactorys'
]);

var rootPath = '/partials/buaaeating/'

buaaeatingApp.config(function($routeProvider){
	$routeProvider.when('/order_confirm',{
		templateUrl: rootPath + 'order_confirm.html',
		controller: 'orderConfirmCtrl'
	}).when('/order_succeed/:orderId',{
		templateUrl: rootPath + 'order_succeed.html',
		controller: 'orderSucceedCtrl'
	}).otherwise({
		templateUrl: rootPath + 'reserve.html',
		controller: 'ReserveCtrl'
	})
})

buaaeatingApp.run(function($rootScope) {
    var titleData = {
        "#/order_confirm": "订单",
        "#/order_succeed": "成功"
    }

    $rootScope.title = ""
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
        if(typeof titleData[location.hash] !== "undefined"){
            $rootScope.title = titleData[location.hash]
        } else{
            $rootScope.title = "订餐"
        }
    });

    // 首页遮罩
    $rootScope.showMask = true
    $rootScope.noticeContent = "这学期结束啦~"
    var today = new Date()

    var workDay = today.getDay(),
        hour = today.getHours(),
        minute = today.getMinutes()

    //if(workDay === 0 || workDay === 6){
    //   $rootScope.showMask = true
    //   $rootScope.noticeContent = "周末休息啦~"
    //}
    //if(hour > 21 || (hour === 21 && minute > 30)){
    //   $rootScope.showMask = true
    //   $rootScope.noticeContent = "太晚了，明天再来~"
    //}
})

buaaeatingApp.config(function($httpProvider) {
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function(obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '='
                            + encodeURIComponent(value) + '&';
                }
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        return angular.isObject(data) && String(data) !== '[object File]'
                ? param(data)
                : data;
    }];
});