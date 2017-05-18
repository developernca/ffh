<?php

class MyPost extends MY_Controller {

    public function __construct() {
        parent::__construct(['html', 'form', 'file'], ['form_validation', 'constant', 'session', 'keygenerator', 'table'], ['account', 'post']);
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
     * Default index funtion for this controller.
     */
    public function index() {
        $this->authenticate();
        $post_type = Constant::POST_TYPE_OPTIONS_ARR;
        $currentuser_post_list = $this->post->get_post_by_user($this->session->userdata(Constant::SESSION_USSID));
        sort($post_type);
        $this->load_view(Constant::MY_POST_VIEW, [Constant::VDN_POST_TYPES_OPTIONS => $post_type, Constant::VDN_CURRENTUSER_POST_LISTS => $currentuser_post_list]);
    }

    /**
     * When user submit a post, validate post and if there is no input error, save to database,
     * otherwise show error to user.
     */
    public function submit() {
        $this->authenticate();
        $validation_err_msg = $this->validate_post();
        if (!is_null($validation_err_msg)) {// Errors
            exit(json_encode([
                'flg' => FALSE,
                'msg' => strip_tags($validation_err_msg)
            ]));
        }
        // get currently inserted post
        $inserted_post = $this->post->insert_post($this->input->post());
        if (!is_null($inserted_post)) {
            exit(json_encode([
                'flg' => TRUE,
                'msg' => $inserted_post
            ]));
        } else {
            exit(json_encode([
                'flg' => FALSE,
                'msg' => 'Unexpectable error occured.'
            ]));
        }
    }

    /**
     * When user edit a post, validate post and if there is no input error, update in database,
     * otherwise show error to user.
     * 
     */
    public function edit() {
        $this->authenticate();
        $validation_err_msg = $this->validate_post();
        if (!is_null($validation_err_msg)) {// Errors
            exit(json_encode([
                'flg' => FALSE,
                'msg' => strip_tags($validation_err_msg)
            ]));
        }
        exit(json_encode([
            'flg' => TRUE,
            'msg' => $this->input->post()
        ]));
        // get currently updated post
        // $inserted_post = $this->post->insert_post($this->input->post());
//        if (!is_null($inserted_post)) {
//            exit(json_encode([
//                'flg' => TRUE,
//                'msg' => $inserted_post
//            ]));
//        } else {
//            exit(json_encode([
//                'flg' => FALSE,
//                'msg' => 'Unexpectable error occured.'
//            ]));
//        }
    }

    private function validate_post() {
        // Title [cannot be blank]
        $this->form_validation->set_rules(Constant::NAME_TEXT_POST_TITLE, '', 'required|max_length[500]', ['required' => 'Title is required. Please enter title.', 'max_length' => 'Title cannot have more than 500 characters.']);
        if (!$this->form_validation->run()) {
            return validation_errors();
        }
        // Content [cannot be blank]
        $this->form_validation->set_rules(Constant::NAME_TEXT_POST_CONTENT, '', 'required', ['required' => 'Post content cannot be blank. Please enter content.']);
        if (!$this->form_validation->run()) {
            return validation_errors();
        }
        // Contact [email format if exist]
        $this->form_validation->set_rules(Constant::NAME_TEXT_CONTACT_EMAIL, '', 'valid_email|max_length[200]', ['valid_email' => Constant::ERR_EMAIL_FORMAT, 'max_length' => Constant::ERR_EMAIL_EXCEED_LENGTH]);
        if (!$this->form_validation->run()) {
            return validation_errors();
        }
        // Contact [phone number format if exist]
        $this->form_validation->set_rules(Constant::NAME_TEXT_CONTACT_PHONE, '', 'max_length[30]|regex_match[/^[\+]{0,1}[0-9]{5,}$/]', ['max_length' => 'Phone number cannot exceed 30 digits', 'regex_match' => 'Invalid number format']);
        if (!$this->form_validation->run()) {
            return validation_errors();
        }
        return null; // No errors, all clear.
    }

}
