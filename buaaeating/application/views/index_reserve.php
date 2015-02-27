<!DOCTYPE html>
<html ng-app="buaaeatingApp">
<head>
<meta charset="UTF-8">
  <meta name="viewport" content="target-densitydpi=get-target-densitydpi, width=device-width, user-scalable=no" />
  <title><?php echo $title?> - 航学长与航学姐</title>
  <link rel="stylesheet" type="text/css" href="<?php echo asset_url();?>stylesheets/common.css" />
  <link rel="stylesheet" type="text/css" href="<?php echo asset_url();?>stylesheets/lib/ionicons.css" />
  <script src="<?php echo asset_url();?>js/framework/angular.min.js"></script>
  <script src="<?php echo asset_url();?>js/framework/angular-touch.min.js"></script>
  <script src="<?php echo asset_url();?>js/framework/angular-route.min.js"></script>
  <script src="<?php echo asset_url();?>js/buaaeating/app.js"></script>
  <script src="<?php echo asset_url();?>js/buaaeating/controllers.js"></script>
  <script src="<?php echo asset_url();?>js/buaaeating/filters.js"></script>
  <script src="<?php echo asset_url();?>js/buaaeating/factorys.js"></script>
</head>
<body ng-controller="reserveParentCtrl">
	<div class="all-wrap">
		<div class="header">
		    <span class="icon-title">航</span>
		    学长外卖 - {{title}}
			<span class="discount-info">新用户首单减2元!</span>
		</div>
    <div ng-view>
    </div>
  </div>
</body>
</html>
