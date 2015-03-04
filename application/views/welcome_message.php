<!DOCTYPE html>
<html ng-app="buaaeatingApp">
<head>
<meta charset="UTF-8">
  <meta name="viewport" content="target-densitydpi=get-target-densitydpi, width=device-width, user-scalable=no" />
  <title><?php echo $title?> - 航学长与航学姐</title>
  <link rel="stylesheet" type="text/css" href="<?php echo asset_url();?>stylesheets/style.css" />
  <script src="<?php echo asset_url();?>js/public/angular.min.js"></script>
  <script src="<?php echo asset_url();?>js/public/angular-touch.min.js"></script>
  <script src="<?php echo asset_url();?>js/buaaeating/controllers.js"></script>
</head>
<body>
	<div class="all-wrap">
		<div class="header">
			<h1 id="header">航学长与航学姐</h1>
		</div>
		<div ng-view>
		</div>
	</div>
</body>
</html>