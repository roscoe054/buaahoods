<?php
class Order extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->load->model('buaaeating/order_model');
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
			$postData['date'] = date('Y-m-d H:i:s');
			$postData['status'] = 0;
			$this->order_model->set_order($postData);
			echo "数据完整";
		} else {
			echo "缺少数据";
		}
	}
}
