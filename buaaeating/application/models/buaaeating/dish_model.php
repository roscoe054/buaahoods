<?php
class Dish_model extends CI_Model {

	public function __construct() {
		$this->load->database();
	}

	public function get_dish($order_id = FALSE) {
		if ($order_id === FALSE) {
			$query = $this->db->get('order_info');
			return $query->result_array();
		}

		$query = $this->db->get_where('order_item', array('order_id' => $order_id));
		return $query->result();
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