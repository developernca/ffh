<?php

class Discussion extends CI_Model {

    public function __construct() {
        parent::__construct();
    }

    public function get_diss_by_postid($post_id) {
        $this->db->select();
        $this->db->join(Constant::TABLE_ACCOUNTS, 'accounts._id = discussions.discussed_by');
        $query = $this->db->get_where(Constant::TABLE_DISCUSSIONS, [Constant::TABLE_DISCUSSION_COLUMN_POST_ID => $post_id]);
        $result_arr = $query->result_array();
        return $result_arr;
    }

}
