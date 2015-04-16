<!DOCTYPE html>
<html ng-app="buaaeatingApp">
<head>
<meta charset="UTF-8">
  <meta name="viewport" content="target-densitydpi=get-target-densitydpi, width=device-width, user-scalable=no" />
  <title><?php echo $title?> - 航学长与航学姐</title>
  <link rel="stylesheet" type="text/css" href="<?php echo asset_url();?>stylesheets/common.css" />
  <link rel="stylesheet" type="text/css" href="<?php echo asset_url();?>stylesheets/lib/ionicons.css" />
  <script src="<?php echo asset_url();?>js/framework/angular.min.js"></script>
  <script src="<?php echo asset_url();?>js/framework/angular-route.min.js"></script>
  <script src="<?php echo asset_url();?>js/framework/ngStorage.js"></script>
  <script src="<?php echo asset_url();?>js/buaaeating/app.js"></script>
  <script src="<?php echo asset_url();?>js/buaaeating/controllers.js"></script>
  <script src="<?php echo asset_url();?>js/buaaeating/filters.js"></script>
  <script src="<?php echo asset_url();?>js/buaaeating/factorys.js"></script>
</head>
<body ng-controller="reserveParentCtrl">
	<div class="all-wrap">

<?php
function _get($str) {
	$val = !empty($_GET[$str]) ? $_GET[$str] : null;
	return $val;
}

//连接数据库
function connectDB($db) {
	//设置默认时区是中国
	date_default_timezone_set("Asia/Shanghai");
	//连接数据库
	$con = mysql_connect("localhost", "roscoe", "cpezcesb");
	if (!$con) {
		$db_status .= mysql_error();
		die('Could not connect: ' . mysql_error());
	}
	mysql_select_db($db, $con);
	return $con;
}
$con = connectDB("buaahoods_data");

//获取token
$token = "none";
$name = "noName";
if (_get('code')) {
//得到code
	$code = $_GET['code'];
	$output = getToken("wx65cfe45c2c6fad4a", "fc123736bb3fa7743e97818b496f5147 ", $code);
	$token = $output->access_token;
	$openid = $output->openid;
	$name = getID($token, $openid);
	if ($name != NULL) {
		$refresh_token = $output->refresh_token;
		mysql_query("INSERT INTO refresh_token (code, token) VALUES ('{$code}','{$refresh_token}')");
	} else {
		$result = mysql_query("SELECT token from refresh_token WHERE code = '{$code}'");
		if (0 != @mysql_num_rows($result)) {
			while ($rowItem = mysql_fetch_array($result)) {
				$refresh_token = $rowItem['token'];
				mysql_query("UPDATE refresh_token SET token = '{$refresh_token}')");
			}
		}
		$output = refresh($refresh_token);
		$token = $output->access_token;
		$openid = $output->openid;
		$name = getID($token, $openid);
	}
	mysql_query("SET NAMES utf8");
	$result = mysql_query("SELECT * FROM order_info WHERE name = '{$name}'");
	$openidResult = mysql_query("SELECT * FROM order_info WHERE name = '{$openid}'");
	if (0 != @mysql_num_rows($result) || 0 != @mysql_num_rows($openidResult)) {
		$newuser = "";
		echo "<div class='username-wrap'>欢迎你，<span id='userName' class='{$newuser}'>{$name}</span></div>";
		echo "<div id='openid' class='hidden'>{$openid}</div>";
	} else {
		$newuser = "newuser";
		echo "<div class='username-wrap'>欢迎你，<span id='userName' class='{$newuser}'>{$name}</span></div>";
		echo "<div id='newUser' class='hidden'></div>";
		echo "<div id='openid' class='hidden'>{$openid}</div>";
	}

} else {
	echo "<div class='username-wrap'>欢迎你，<span id='userName'class=''>请关注buaaeating后订餐</span></div>";
}

function getToken($appID, $appsecret, $code) {
	$output = null;
	//初始化
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx65cfe45c2c6fad4a&secret=fc123736bb3fa7743e97818b496f5147&code={$code}&grant_type=authorization_code");
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	$output = curl_exec($ch);
	curl_close($ch);
	$output = json_decode($output);
	return ($output);
}

function refresh($refresh_token) {
	$output = null;
	//初始化
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, "https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=wx65cfe45c2c6fad4a&grant_type=refresh_token&refresh_token={$refresh_token}");
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	$output = curl_exec($ch);
	curl_close($ch);
	$output = json_decode($output);
	return ($output);
}

function getID($token, $openid) {
	$output = null;
	//初始化
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, "https://api.weixin.qq.com/sns/userinfo?access_token={$token}&openid={$openid}&lang=zh_CN");
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	$output = curl_exec($ch);
	curl_close($ch);
	$output = json_decode($output);
	$output = $output->nickname;
	return ($output);
}

?>
		<div class="header">
		    <span class="icon-title">航</span>
		    学长外卖 - {{title}}
			<span class="discount-info">{{welcomeWords}}</span>
		</div>
    <div ng-view>
    </div>

    <div class="notice-wrap" ng-show="showMask">
      <div class="notice">
        {{noticeContent}}
      </div>
    </div>
  </div>
</body>
</html>
