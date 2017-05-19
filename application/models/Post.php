<?php

/**
 * Model class for posts table.
 * 
 * @author Nyein Chan Aung<developernca@gmail.com>
 */
class Post extends CI_Model {

    private $base_path;
    private $posted_user;

    public function __construct() {
        parent::__construct();
        $this->posted_user = $this->session->userdata(Constant::SESSION_USSID);
        $this->base_path = FCPATH . DIRECTORY_SEPARATOR . 'usr' . DIRECTORY_SEPARATOR . $this->posted_user . DIRECTORY_SEPARATOR; // ffh/usr/usr_id/
    }

    /**
     * Insert new data to posts table.
     * 
     * @param array $data user submitted form data
     * @return array created data as array or null on failure
     */
    public function insert_post(array $data) {
        // generate id
        $post_id = null;
        do {
            $post_id = KeyGenerator::getAlphaNumString(10, true, true);
            $query = $this->db->get_where(Constant::TABLE_POSTS, [Constant::TABLE_POSTS_COLUMN_ID => $post_id]);
            $result = $query->result();
        } while (!empty($result));
        // create file
        $post_content_file = null;
        do {
            $post_content_file = $this->base_path . KeyGenerator::getAlphaNumString(10, true, true) . '.txt';
            $is_file_exist = file_exists($post_content_file);
        } while ($is_file_exist);
        // write content to file
        write_file($post_content_file, $data[Constant::NAME_TEXT_POST_CONTENT]);
        // sort array to check select box data
        $type_arr = Constant::POST_TYPE_OPTIONS_ARR;
        sort($type_arr);
        // insert into table
        $values = [
            Constant::TABLE_POSTS_COLUMN_ID => $post_id,
            Constant::TABLE_POSTS_COLUMN_POST_TITLE => $data[Constant::NAME_TEXT_POST_TITLE],
            Constant::TABLE_POSTS_COLUMN_TEXT_FILENAME => $post_content_file,
            Constant::TABLE_POSTS_COLUMN_CONTACT_EMAIL => (!empty($data[Constant::NAME_TEXT_CONTACT_EMAIL])) ? $data[Constant::NAME_TEXT_CONTACT_EMAIL] : NULL,
            Constant::TABLE_POSTS_COLUMN_CONTACT_PHONE => (!empty($data[Constant::NAME_TEXT_CONTACT_PHONE])) ? $data[Constant::NAME_TEXT_CONTACT_PHONE] : NULL,
            Constant::TABLE_POSTS_COLUMN_REMARK => (!empty($data[Constant::NAME_TEXT_POST_REMARK])) ? $data[Constant::NAME_TEXT_POST_REMARK] : NULL,
            Constant::TABLE_POSTS_COLUMN_TYPE => $type_arr[$data[Constant::NAME_SELECT_POST_TYPE]],
            Constant::TABLE_POSTS_COLUMN_POSTED_TIME => $data[Constant::NAME_HIDDEN_POST_CREATEDAT],
            Constant::TABLE_POSTS_COLUMN_UPDATED_TIME => $data[Constant::NAME_HIDDEN_POST_CREATEDAT],
            Constant::TABLE_POSTS_COLUMN_ACCOUNT_ID => $this->posted_user
        ];
        $insert_success = $this->db->insert(Constant::TABLE_POSTS, $values);
        unset($type_arr);
        if ($insert_success) {
            $values[Constant::TABLE_POSTS_COLUMN_TEXT_FILENAME] = auto_link(nl2br(file_get_contents($values[Constant::TABLE_POSTS_COLUMN_TEXT_FILENAME]))); // unset post_text_file_name and set file content
            return $values;
        } else {
            return NULL;
        }
    }

    public function update_post(array $data) {
        
    }

    /**
     * Get post by posted user.
     * @param String $id account_id of desired user
     * @return mixed return result set as array or null in case of no post
     */
    public function get_post_by_user($id) {
        $this->db->select();
        $this->db->from(Constant::TABLE_POSTS);
        $this->db->where(Constant::TABLE_POSTS_COLUMN_ACCOUNT_ID, $id); // where -> get post by id
        $this->db->order_by(Constant::TABLE_POSTS_COLUMN_UPDATED_TIME, 'DESC');
        $query = $this->db->get();
        $result = $query->result_array();
        if (is_null($result) || empty($result)) {
            return NULL;
        } else {
            $resultLength = count($result);
            for ($col = 0; $col < $resultLength; $col++) {
                $file_contents = nl2br(file_get_contents($result[$col][Constant::TABLE_POSTS_COLUMN_TEXT_FILENAME]));
                $result[$col][Constant::TABLE_POSTS_COLUMN_TEXT_FILENAME] = auto_link($file_contents); // unset post_text_file_name and set file content
            }
            return $result;
        }
    }

}
