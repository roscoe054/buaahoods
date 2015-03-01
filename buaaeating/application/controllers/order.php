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
		$orderData = ['orderItems', 'building', 'room', 'phone', 'price', 'drink', 'name', 'delTime', 'discount_type_new', 'discount_type_code'];
		foreach ($orderData as $item) {
			if (array_key_exists($item, $postData)) {
				// echo "该数组中包含了{$item}:\n";
			} else {
				$dataComplete = false;
				echo "缺少{$item}\n";
			}
		}

		if ($dataComplete) {
			// 添加必要数据来insert order / dish
			$postData['date'] = date('Y-m-d H:i:s');
			$postData['status'] = 0;
			$dishesData = $postData['orderItems'];

			// insert order & get orderId
			$orderId = $this->order_model->set_order($postData);

			// insert dish
			foreach ($dishesData as $dish) {
				$this->dish_model->set_dish($dish, $orderId, $postData['date']);
			}

			echo "succeed $orderId";
			// print json_encode($data['discount']);
		} else {
			echo "缺少数据";
		}
	}

	public function query_order() {
		$orderId = $this->input->get('$orderId', TRUE);

		echo "id: $orderId";
	}
}
