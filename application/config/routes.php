<?php if (!defined('BASEPATH')) {
	exit('No direct script access allowed');
}

/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	http://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There area two reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router what URI segments to use if those provided
| in the URL cannot be matched to a valid route.
|
 */
$routeRoot = '';

// 获取优惠码
$route['discount/get_discount/(:any)'] = 'discount/get_discount/$1';
$route['discount/get_discount'] = 'discount/get_discount';

// 查询订单
$route['order/query_order/(:any)'] = 'order/query_order/$1';
$route['order/query_order'] = 'order/query_order';

// 提交订单
$route['order/submit_order/(:any)'] = '/order/submit_order/$1';
$route['order/submit_order'] = '/order/submit_order';

$route['buaaeating/reserve'] = 'buaaeating/reserve';
$route['buaaeating/(:any)'] = 'buaaeating/view/$1';

$route['news/json_get_news'] = 'news/json_get_news';
$route['news/create'] = 'news/create';
$route['news/(:any)'] = 'news/view/$1';
$route['news'] = 'news';

$route['(:any)'] = 'pages/home';
$route['404_override'] = 'buaaeating/reserve';
$route['default_controller'] = 'welcome';

/* End of file routes.php */
/* Location: ./application/config/routes.php */