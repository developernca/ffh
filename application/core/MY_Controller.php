<?php

/**
 * Base class for all other controllers in this 
 * application. Every controller should extend this
 * controller and not directly extend CI_Controller.
 * 
 * @author Nyein Chan Aung<developernca@gmail.com>
 */
class MY_Controller extends CI_Controller {

    /**
     * Initialize parent constructor and
     * load helpers and libraries if not null.
     * auto load libraries : user_agent, constant
     * auto load helpers : url
     * 
     * @param array $helper_name_list helpers 
     * @param array $library_name_list libraries
     * @param array $model_name_list models
     */
    public function __construct($helper_name_list = null, $library_name_list = null, $model_name_list = null) {
        parent::__construct();

        if (!empty($helper_name_list) && !is_null($helper_name_list)) {
            $this->load->helper($helper_name_list);
        }
        if (!empty($library_name_list) && !is_null($library_name_list)) {
            $this->load->library($library_name_list);
        }
        if (!empty($model_name_list) && !is_null($model_name_list)) {
            $this->load->model($model_name_list);
        }
        $this->load->database();
    }

    /**
     * authenticate every request.
     */
    protected function authenticate() {
        $session_id = $this->session->userdata(Constant::SESSION_USSID); //get_cookie(Constant::COOKIE_USSID);
        if (!is_null($session_id)) {
            /**
             * If cookie session id (which come from client/browser side) and 
             * session id (which exist in server side) are equal, then the result
             * will be assumed as valid session id (no fake cookie id) exist.
             * Session id means _id column of accounts table.
             */
            if ($this->account->is_activated($this->session->userdata(Constant::SESSION_USSID), $this->session->userdata(Constant::SESSION_EMAIL))) {
                return Constant::AUTH_ALREADY_LOGIN;
            } else if (!$this->account->is_activated($this->session->userdata(Constant::SESSION_USSID), $this->session->userdata(Constant::SESSION_EMAIL))) {
                return Constant::AUTH_ACTIVATION_REQUIRED;
            }
        } else {
            $this->session->unset_userdata(Constant::SESSION_USSID);
            return Constant::AUTH_SESSION_NOT_EXIST;
        }
    }

    /**
     * load view
     * @param string $name name of view to load
     * @param array $view_data data to use in view and should only be non nested key-value array[optional]
     */
    protected function load_view($name, $view_data = null) {
        $data['view'] = $name;
        $data['is_mobile'] = $this->agent->is_mobile();
        if (!is_null($view_data)) {
            foreach ($view_data as $key => $value) {
                $data[$key] = $value;
            }
        }
        $this->load->view('main_view', $data);
    }

    /**
     * Sign out
     */
    protected function signout() {
        $this->session->sess_destroy();
        redirect(base_url());
        exit();
    }

}
