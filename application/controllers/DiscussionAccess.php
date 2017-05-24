<?php

/**
 *
 *
 * @author Nyein Chan Aung <developernca@gmail.com>
 */
class DiscussionAccess extends MY_Controller {

    public function __construct() {
        parent::__construct(['date', 'html', 'form', 'file'], ['constant', 'session', 'keygenerator', 'table'], ['account', 'post', 'discussion']);
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

    public function submit() {
        $this->authenticate();
        $discussions_inserted = $this->discussion->insert_discussion($this->input->post());
        if (!is_null($discussions_inserted)) {
            exit(json_encode([
                'flg' => TRUE,
                'msg' => $discussions_inserted
            ]));
        } else {
            exit(json_encode([
                'flg' => FALSE,
            ]));
        }
    }

    public function get($post_id) {
        $discussion_list = $this->discussion->get_diss_by_postid($post_id);
        if (!is_null($discussion_list)) {
            exit(json_encode([
                'flg' => TRUE,
                'msg' => $discussion_list
            ]));
        } else {
            exit(json_encode([
                'flg' => FALSE
            ]));
        }
    }

}
