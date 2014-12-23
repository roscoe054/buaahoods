var buaaeatingFilters = angular.module('buaaeatingFilters', []);

buaaeatingFilters.filter('dishNotEmpty', function() {
  return function(dish) {
  	console.log(dish)
    return dish.count !== 0
  };
});