<?php
class Buaaeating extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->load->model('buaaeating/order_model');
	}

	public function index() {
		$this->load->view('templates/header', $data);
		$this->load->view('buaaeating/index', $data);
		$this->load->view('templates/footer');
	}

	public function reserve() {
		$data['title'] = '订外卖';

		$this->load->view('templates/header', $data);
		$this->load->view('buaaeating/reserve', $data);
		$this->load->view('templates/footer');
	}

}