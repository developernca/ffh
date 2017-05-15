<?php

class Confirmation extends MY_Controller {

    public function __construct() {
        parent::__construct(['html', 'form'], ['constant', 'session'], ['account']);
    }

    /**
     * @override
     * @return boolean true on authentication success, otherwise redirect
     */
    protected function authenticate() {
        $authentication_flag = parent::authenticate();
        if ($authentication_flag === Constant::AUTH_ACTIVATION_REQUIRED) {
            return;
        } else if ($authentication_flag === Constant::AUTH_SESSION_NOT_EXIST) {
            ($this->input->is_ajax_request()) ?
                    exit(json_encode(['flg' => TRUE, 'action' => base_url()])) :
                    redirect(base_url());
            exit();
        } else if ($authentication_flag === Constant::AUTH_ALREADY_LOGIN) {
            ($this->input->is_ajax_request()) ?
                    exit(json_encode(['flg' => TRUE, 'action' => base_url() . 'index.php/home'])) :
                    redirect(base_url() . 'index.php/home');
            exit();
        }
    }

    /**
     * default function.
     */
    public function index() {
        $this->authenticate();
        $this->load_view(Constant::CONFIRMATION_VIEW, null);
    }

    public function activate() {
        $this->authenticate();
        $code = $this->input->post(Constant::NAME_TEXT_ACTIVATION_CODE);
        if (empty(trim($code))) {// return with error if code was blank
            exit(json_encode([
                'flg' => FALSE
                , 'msg' => Constant::ERR_BLANK_ACTCODE
            ]));
        } else if (strlen($code) != 6) {// return with error if code was longer than 6 or less than 6
            exit(json_encode([
                'flg' => FALSE
                , 'msg' => Constant::ERR_LONGER_ACTCODE
            ]));
        } else {// if no error
            // activate 
            $activation_success = $this->account->activate_account(
                $this->session->userdata(Constant::SESSION_USSID)
                , $this->session->userdata(Constant::SESSION_EMAIL)
                , $code);

            if ($activation_success) {// activation success
                exit(json_encode([
                    'flg' => $activation_success,
                    'action' => base_url() . 'index.php/home'
                ]));
            }
            if (!$activation_success) { // code mismatch
                exit(json_encode([
                    'flg' => $activation_success
                    , 'msg' => Constant::ERR_ACTVCODE_MISMATCH
                ]));
            }
            if (is_null($activation_success)) {// database update failure
                exit(json_encode([
                    'flg' => FALSE
                    , 'msg' => Constant::ERR_ACTVCODE_UPDATE
                ]));
            }
        }
    }

    public function signout() {
        parent::signout();
    }

}
