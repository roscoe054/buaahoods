<?php
class Order_model extends CI_Model {

	public function __construct() {
		$this->load->database();
	}

	public function get_order($id = FALSE) {
		if ($id === FALSE) {
			$query = $this->db->get('order_info');
			return $query->result_array();
		}

		$query = $this->db->get_where('order_info', array('id' => $id));
		return $query->row_array();
	}

	public function set_order($data) {
		unset($data['orderItems']);
		unset($data['drink']);
		// print json_encode($data);
		return $this->db->insert('order_info', $data);
	}

}