<?php

class Discussion extends CI_Model {

    private $posted_userr;
    private $base_path;

    public function __construct() {
        parent::__construct();
        $this->posted_user = $this->session->userdata(Constant::SESSION_USSID);
        $this->base_path = FCPATH . DIRECTORY_SEPARATOR . 'usr' . DIRECTORY_SEPARATOR . $this->posted_user . DIRECTORY_SEPARATOR; // ffh/usr/usr_id/
    }

    public function get_diss_by_postid($post_id) {
        $this->db->select('accounts.name ,discussions.*');
        $this->db->join(Constant::TABLE_ACCOUNTS, 'accounts._id = discussions.discussed_by');
        $query = $this->db->get_where(Constant::TABLE_DISCUSSIONS, [Constant::TABLE_DISCUSSION_COLUMN_POST_ID => $post_id]);
        $result = $query->result_array();
        if (is_null($result) || empty($result)) {
            return NULL;
        } else {
            // set file path with file contents
            $resultLength = count($result);
            for ($col = 0; $col < $resultLength; $col++) {
                $file_contents = nl2br(file_get_contents($result[$col][Constant::TABLE_DISCUSSION_COLUMN_FILENAME]));
                $result[$col][Constant::TABLE_DISCUSSION_COLUMN_FILENAME] = auto_link($file_contents, 'url', TRUE);
                unset($result[$col][Constant::TABLE_DISCUSSION_COLUMN_DISCUSSEDBY]); // unset discussed user id
            }
            return $result;
        }
    }

    /**
     * Insert new record in discussions table. 
     * Generate unique id and unique file name for discussion text.
     * Write discussion to text.
     * 
     * @param type $data user submitted form data
     * @return mixed return submitted data on success or null on failure
     */
    public function insert_discussion($data) {
        $diss_id = null;
        do {
            $diss_id = KeyGenerator::getAlphaNumString(10, true, true);
            $query = $this->db->get_where(Constant::TABLE_DISCUSSIONS, [Constant::TABLE_DISCUSSION_COLUMN_ID => $diss_id]);
            $result = $query->result();
        } while (!empty($result));
        // create file
        $filename = null;
        do {
            $filename = $this->base_path . KeyGenerator::getAlphaNumString(10, true, true) . '.txt';
            $is_file_exist = file_exists($filename);
        } while ($is_file_exist);
        // write content to file
        write_file($filename, $data['diss'], 'w+');
        // values to insert
        $values = [
            Constant::TABLE_POSTS_COLUMN_ID => $diss_id,
            Constant::TABLE_DISCUSSION_COLUMN_FILENAME => $filename,
            Constant::TABLE_DISCUSSION_COLUMN_DISCUSSEDBY => $this->posted_user,
            Constant::TABLE_DISCUSSION_COLUMN_POST_ID => $data['pid']
        ];
        // insert
        $insert_success = $this->db->insert(Constant::TABLE_DISCUSSIONS, $values);
        if ($insert_success) {
            $values[Constant::TABLE_DISCUSSION_COLUMN_FILENAME] = auto_link(nl2br(file_get_contents($filename)), 'url', TRUE);
            return $values;
        } else {
            return NULL;
        }
    }

}
