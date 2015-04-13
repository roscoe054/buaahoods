<?php
class Order extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->load->model('buaaeating/order_model');
		$this->load->model('buaaeating/dish_model');
	}

	public function submit_order() {
		// 获取数据
		$postData = $this->input->post(NULL, TRUE);

		// 验证POST数据中所有需要的项
		$dataComplete = true;
		// $orderData = ['orderItems', 'building', 'room', 'phone', 'name', 'delTime', 'discount_type_new', 'discount_type_code'];
		// foreach ($orderData as $item) {
		// 	if (array_key_exists($item, $postData)) {
		// 		// echo "该数组中包含了{$item}:\n";
		// 	} else {
		// 		$dataComplete = false;
		// 		echo "缺少{$item}\n";
		// 	}
		// }

		if ($dataComplete) {
			// 添加必要数据来insert order / dish
			$postData['date'] = date('Y-m-d H:i:s');
			$postData['status'] = 0;
			$dishesData = $postData['orderItems'];

			// 计算总价
			$pirceSum = "";
			foreach ($dishesData as $dish) {
				if ($dish['dishId'] <= 103) {
					$pirceSum += 15 * $dish['count'];
				} else {
					$pirceSum += 13 * $dish['count'];
				}
			}
			$drinksArr = explode(", ", $postData['drink']);
			if ($postData['drink'] != "") {
				foreach ($drinksArr as $drink) {
					$drinkNum = explode("x", $drink)[1];
					$pirceSum += $drinkNum * 3;
				}
			}
			if ($postData['discount_type_code'] == 1) {
				$pirceSum -= 2;
			}
			if ($postData['discount_type_new'] == 1) {
				$pirceSum -= 2;
			}
			$postData['price'] = $pirceSum;

			// insert order & get orderId
			$orderId = $this->order_model->set_order($postData);

			// insert dish
			foreach ($dishesData as $dish) {
				$this->dish_model->set_dish($dish, $orderId, $postData['date']);
			}

			// 返回订单成功状态和id
			$returnData = array('status' => "succeed", 'orderId' => $orderId);
			echo json_encode($returnData);
		} else {
			$returnData = array('status' => "error");
			echo json_encode($returnData);
		}
	}

	public function query_order() {
		$returnData = array('status' => "error", 'data' => array('order' => '', 'dish' => array()));
		$orderId = $this->input->get('orderId', TRUE);

		if ($orderId != "") {
			$returnData['status'] = "succeed";
			$returnData['data']['order'] = $this->order_model->get_order($orderId);
			$returnData['data']['dish'] = $this->dish_model->get_dish($orderId);
		}

		echo json_encode($returnData);
	}
}
