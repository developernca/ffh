<?php

class Home extends MY_Controller {

    public function __construct() {
        parent::__construct(['html', 'form'], ['constant', 'session', 'pagination', 'table'], ['account', 'post', 'discussion']);
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
        // get row count for pagination (count all posts)
        $row_count = $this->post->count_all_posts();
        // pagination configuration array
        $config['base_url'] = base_url() . 'index.php/home/index/';
        $config['total_rows'] = $row_count;
        $config['per_page'] = 10;
        $config['uri_segment'] = 3;
        // initialize pagination
        $this->pagination->initialize($config);
        $start = ($this->uri->segment(3)) ? $this->uri->segment(3) : 0;
        // get all posts
        $all_post = $this->post->get_all_posts(10, $start);
        // get and sort post type array
        $post_type = Constant::POST_TYPE_OPTIONS_ARR;
        sort($post_type);
        $this->load_view(
            Constant::HOME_VIEW, [
            Constant::VDN_ALL_POSTS => $all_post,
            Constant::VDN_POST_TYPES_OPTIONS => $post_type,
            Constant::VDN_TOTAL_POSTS_COUNT => $row_count,
            Constant::VDN_PAGINATION_LINK => $this->pagination->create_links()
        ]);
    }

    // @override
    public function signout() {
        $this->authenticate();
        parent::signout();
    }

}
