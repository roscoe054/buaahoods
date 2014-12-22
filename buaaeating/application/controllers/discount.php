<?php
class Discount extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->load->model('buaaeating/discount_model');
	}

	public function get_discount() {
		$code = $_GET['code'];
		$data['discount'] = $this->discount_model->get_discount($code);

		print json_encode($data['discount']);
	}

}