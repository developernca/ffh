<?php

/**
 * 
 *  
 * @author Nyein Chan Aung <developernca@gmail.com>
 */
class DiscussionAccess extends MY_Controller {

    public function __construct() {
        parent::__construct(['date', 'html', 'form'], ['constant', 'session', 'keygenerator', 'table'], ['account', 'post', 'discussion']);
    }

    /**
     * Authenticate user request
     *
     * @override authenticate()
     */
    protected function authenticate() {
        // Discussion should be call only via ajax request
        // If not so (unpermitted request), redirect to home page
        if (!$this->input->is_ajax_request()) {
            redirect(base_url());
            exit();
        }
        $authentication_flag = parent::authenticate();
        if ($authentication_flag === Constant::AUTH_ACTIVATION_REQUIRED) {
            exit(json_encode(['flg' => TRUE, 'action' => base_url() . 'index.php/confirmation']));
        } else if ($authentication_flag === Constant::AUTH_SESSION_NOT_EXIST) {
            exit(json_encode(['flg' => TRUE, 'action' => base_url()]));
        } else if ($authentication_flag === Constant::AUTH_ALREADY_LOGIN) {
            return;
        }
    }

    public function get($_id) {
        $discussions = $this->discussion->get_diss_by_postid($_id);
        exit(json_encode($discussions));
    }

}
