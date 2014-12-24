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

	public function set_order() {
		$data = array(
			'title' => $this->input->post('title'),
			'text' => $this->input->post('text'),
		);

		// return $this->db->insert('news', $data);
	}

}