<?php
class Discount_model extends CI_Model {

	public function __construct() {
		$this->load->database();
	}

	public function get_discount($code) {
		if ($code != "") {
			$query = $this->db->get_where('order_discount', array('discountCode' => $code));

			if ($query->num_rows() > 0) {
				$row = $query->row();
				return $row;
			}
		}
	}
}