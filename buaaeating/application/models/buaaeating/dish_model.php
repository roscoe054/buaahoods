<?php
class Dish_model extends CI_Model {

	public function __construct() {
		$this->load->database();
	}

	public function set_dish($dish, $orderId, $date) {
		$dishData['name'] = $dish['name'];
		$dishData['num'] = $dish['count'];
		$dishData['favor'] = $dish['favor'];
		$dishData['order_id'] = $orderId;
		$dishData['item_date'] = $date;
		return $this->db->insert('order_item', $dishData);
	}
}