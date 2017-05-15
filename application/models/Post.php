<?php

class Post extends CI_Model {

    public function __construct() {
        parent::__construct();
    }

    public function insert_post(array $data) {
        // generate id
        $post_id = null;
        do {
            $post_id = KeyGenerator::getAlphaNumString(10, true, true);
            $query = $this->db->get_where(Constant::TABLE_POSTS, [Constant::TABLE_POSTS_COLUMN_ID => $post_id]);
            $result = $query->result();
        } while (!empty($result));

        // insert into table
        $values = [
            Constant::TABLE_POSTS_COLUMN_ID => $post_id,
            Constant::TABLE_POSTS_COLUMN_POST_TITLE => $data[Constant::NAME_TEXT_POST_TITLE],
            Constant::TABLE_POSTS_COLUMN_TEXT_FILENAME => ''
        ];
    }

}
