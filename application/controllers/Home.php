<?php

class Home extends MY_Controller {

    public function __construct() {
        parent::__construct(['html', 'form'], ['constant', 'session'], ['account']);
    }

    // @override
    protected function authenticate() {

        $authentication_flag = parent::authenticate();
        if ($authentication_flag === Constant::AUTH_ACTIVATION_REQUIRED) {
            ($this->input->is_ajax_request()) ?
                    exit(json_encode(['flg' => TRUE, 'action' => base_url() . 'index.php/confirmation'])) :
                    redirect(base_url() . 'index.php/confirmation');
            exit();
        } else if ($authentication_flag === Constant::AUTH_SESSION_NOT_EXIST) {
            ($this->input->is_ajax_request()) ?
                    exit(json_encode(['flg' => TRUE, 'action' => base_url()])) :
                    redirect(base_url());
            exit();
        } else if ($authentication_flag === Constant::AUTH_ALREADY_LOGIN) {
            return;
        }
    }

    /**
     * default function
     */
    public function index() {
        $this->authenticate();
        $this->load_view(Constant::HOME_VIEW);
    }

    // @override
    public function signout() {
        $this->authenticate();
        parent::signout();
    }

}
