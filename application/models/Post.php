<?php

/**
 * Model class for posts table.
 *
 * @author Nyein Chan Aung<developernca@gmail.com>
 */
class Post extends CI_Model {

    private $base_path;
    private $posted_user;
    private $type_arr;

    public function __construct() {
        parent::__construct();
        $this->posted_user = $this->session->userdata(Constant::SESSION_USSID);
        $this->base_path = FCPATH . DIRECTORY_SEPARATOR . 'usr' . DIRECTORY_SEPARATOR . $this->posted_user . DIRECTORY_SEPARATOR; // ffh/usr/usr_id/
        // sort array to check select box data
        $this->type_arr = Constant::POST_TYPE_OPTIONS_ARR;
        sort($this->type_arr);
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
        write_file($post_content_file, $data[Constant::NAME_TEXT_POST_CONTENT], 'w+');
        sort($this->type_arr);
        $type_text = $this->type_arr[$data[Constant::NAME_SELECT_POST_TYPE]];
        // insert into table
        $values = [
            Constant::TABLE_POSTS_COLUMN_ID => $post_id,
            Constant::TABLE_POSTS_COLUMN_POST_TITLE => $data[Constant::NAME_TEXT_POST_TITLE],
            Constant::TABLE_POSTS_COLUMN_TEXT_FILENAME => $post_content_file,
            Constant::TABLE_POSTS_COLUMN_CONTACT_EMAIL => (!empty($data[Constant::NAME_TEXT_CONTACT_EMAIL])) ? $data[Constant::NAME_TEXT_CONTACT_EMAIL] : NULL,
            Constant::TABLE_POSTS_COLUMN_CONTACT_PHONE => (!empty($data[Constant::NAME_TEXT_CONTACT_PHONE])) ? $data[Constant::NAME_TEXT_CONTACT_PHONE] : NULL,
            Constant::TABLE_POSTS_COLUMN_REMARK => (!empty($data[Constant::NAME_TEXT_POST_REMARK])) ? $data[Constant::NAME_TEXT_POST_REMARK] : NULL,
            Constant::TABLE_POSTS_COLUMN_TYPE => $type_text,
            Constant::TABLE_POSTS_COLUMN_POSTED_TIME => $data[Constant::NAME_HIDDEN_POST_CREATEDAT],
            Constant::TABLE_POSTS_COLUMN_UPDATED_TIME => $data[Constant::NAME_HIDDEN_POST_CREATEDAT],
            Constant::TABLE_POSTS_COLUMN_ACCOUNT_ID => $this->posted_user
        ];
        $insert_success = $this->db->insert(Constant::TABLE_POSTS, $values);

        if ($insert_success) {
            $values['type_num'] = $data[Constant::NAME_SELECT_POST_TYPE]; // use to set type number in javascript
            $values[Constant::TABLE_POSTS_COLUMN_TEXT_FILENAME] = auto_link(nl2br(file_get_contents($values[Constant::TABLE_POSTS_COLUMN_TEXT_FILENAME])), 'url', TRUE); // unset post_text_file_name and set file content
            return $values;
        } else {
            return NULL;
        }
    }

    /**
     * Update existing data in posts table.
     * Update file contents of post.
     *
     * @param array $data user submitted form data
     */
    public function update_post(array $data) {
        // update file contents [write file content to existing files]
        $this->db->select(Constant::TABLE_POSTS_COLUMN_TEXT_FILENAME);
        $path = $this->db->get_where(Constant::TABLE_POSTS, [Constant::TABLE_POSTS_COLUMN_ID => $data[Constant::NAME_HIDDEN_POST_ID]])->result_array();
        //write_file($path, $data[Constant::NAME_TEXT_POST_CONTENT], 'w+');
        write_file($path[0][Constant::TABLE_POSTS_COLUMN_TEXT_FILENAME], $data[Constant::NAME_TEXT_POST_CONTENT]);
        $data[Constant::NAME_TEXT_POST_CONTENT] = auto_link(nl2br($data[Constant::NAME_TEXT_POST_CONTENT]), 'url', TRUE);
        // post type
        $post_type = $this->type_arr[$data[Constant::NAME_SELECT_POST_TYPE]];
        $data[Constant::NAME_SELECT_POST_TYPE] = $post_type;
        // update in database
        $this->db->where(Constant::TABLE_POSTS_COLUMN_ID, $data[Constant::NAME_HIDDEN_POST_ID]);
        $this->db->where(Constant::TABLE_POSTS_COLUMN_ACCOUNT_ID, $this->posted_user);
        $result = $this->db->update(Constant::TABLE_POSTS, [
            Constant::TABLE_POSTS_COLUMN_POST_TITLE => $data[Constant::NAME_TEXT_POST_TITLE],
            Constant::TABLE_POSTS_COLUMN_CONTACT_EMAIL => (!empty($data[Constant::NAME_TEXT_CONTACT_EMAIL])) ? $data[Constant::NAME_TEXT_CONTACT_EMAIL] : NULL,
            Constant::TABLE_POSTS_COLUMN_CONTACT_PHONE => (!empty($data[Constant::NAME_TEXT_CONTACT_PHONE])) ? $data[Constant::NAME_TEXT_CONTACT_PHONE] : NULL,
            Constant::TABLE_POSTS_COLUMN_TYPE => $post_type,
            Constant::TABLE_POSTS_COLUMN_REMARK => (!empty($data[Constant::NAME_TEXT_POST_REMARK])) ? $data[Constant::NAME_TEXT_POST_REMARK] : NULL,
            Constant::TABLE_POSTS_COLUMN_UPDATED_TIME => $data[Constant::NAME_HIDDEN_POST_UPDATEDAT]
        ]);
        return $result ? $data : NULL;
    }

    /**
     *

     * Get post by posted user.
     * @param String $id account_id of desired user
     * @param int $limit row limit for pagination
     * @param int $start pointer for start row
     * @return mixed return result set as array or null in case of no post
     */
    public function get_post_by_user($id, $limit, $start) {
        $this->db->limit($limit, $start);
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
                $result[$col][Constant::TABLE_POSTS_COLUMN_TEXT_FILENAME] = auto_link($file_contents, 'url', TRUE); // unset post_text_file_name and set file content
            }
            return $result;
        }
    }

    /**
     * Count all posts by posted user.
     *
     * @param type $id current user id, ussid
     * @return int number of rows
     */
    public function count_post_by_user($id) {
        return $this->db->where(Constant::TABLE_POSTS_COLUMN_ACCOUNT_ID, $id)->from(Constant::TABLE_POSTS)->count_all_results();
    }

    /**
     * Count all posts. This will be used to show post count
     * on page.
     */
    public function count_all_posts() {
        return $this->db->from(Constant::TABLE_POSTS)->count_all_results();
    }

    /**
     * Get all posts in table.
     *
     * @param type $limit row limit for pagination
     * @param type $start pointer for start rowSSFS
     * @return mixed return result array if data exist or null on not
     */
    public function get_all_posts($limit, $start) {
        $this->db->join(Constant::TABLE_ACCOUNTS, "accounts._id = posts.account_id");
        $this->db->select("accounts.name, posts.*");
        $this->db->limit($limit, $start);
        $this->db->order_by(Constant::TABLE_POSTS_COLUMN_UPDATED_TIME, 'DESC');
        $query = $this->db->get(Constant::TABLE_POSTS);
        $result = $query->result_array();
        if (is_null($result) || empty($result)) {
            return NULL;
        } else {
            $resultLength = count($result);
            for ($col = 0; $col < $resultLength; $col++) {
                $file_contents = nl2br(file_get_contents($result[$col][Constant::TABLE_POSTS_COLUMN_TEXT_FILENAME]));
                $result[$col][Constant::TABLE_POSTS_COLUMN_TEXT_FILENAME] = auto_link($file_contents, 'url', TRUE); // unset post_text_file_name and set file content
            }
            return $result;
        }
    }

    /**
     * Delete post by post id. Because of id is unique
     * data will be deleted one item at a time.
     *
     * @param String $id post_id
     * @return Boolean true on success, false on failure
     */
    public function delete_post_by_id($id) {
        $this->db->trans_start();
        // get all discussion file name related to current post to delete
        $this->db->select(Constant::TABLE_DISCUSSION_COLUMN_FILENAME);
        $diss_result_list = $this->db->get_where(Constant::TABLE_DISCUSSIONS, [Constant::TABLE_DISCUSSION_COLUMN_POST_ID => $id])->result_array();
        // get post content file name
        $this->db->select(Constant::TABLE_POSTS_COLUMN_TEXT_FILENAME);
        $post_result_list = $this->db->get_where(Constant::TABLE_POSTS, [Constant::TABLE_POSTS_COLUMN_ID => $id])->result_array();

        // =================== Table delete ===========================
        //
        // delete all discussions related to current post.
        $this->db->where(Constant::TABLE_DISCUSSION_COLUMN_POST_ID, $id);
        $dissdel_success = $this->db->delete(Constant::TABLE_DISCUSSIONS);
        if (!$dissdel_success) {// if deletion failure, transaction rollback and return false
            $this->db->trans_rollback();
            return FALSE;
        }
        // delete post
        $this->db->where(Constant::TABLE_POSTS_COLUMN_ID, $id);
        $this->db->where(Constant::TABLE_POSTS_COLUMN_ACCOUNT_ID, $this->posted_user);
        $postdel_success = $this->db->delete(Constant::TABLE_POSTS);
        if (!$postdel_success) {// if deletion failure, transaction rollback and return false
            $this->db->trans_rollback();
            return FALSE;
        }

        // =================== File delete ===========================
        //
        // delete actual discussions files
        foreach ($diss_result_list as $value) {
            $diss_file_delsuccess = unlink($value[Constant::TABLE_DISCUSSION_COLUMN_FILENAME]);
            if (!$diss_file_delsuccess) { // if file deletion failure transaction rollback and return false
                $this->db->trans_rollback();
                return FALSE;
            }
        }
        // delete acutal post file
        $post_file_delsuccess = unlink($post_result_list[0][Constant::TABLE_POSTS_COLUMN_TEXT_FILENAME]);
        if (!$post_file_delsuccess) {// if file deletion failure transaction rollback and return false
            $this->db->trans_rollback();
            return FALSE;
        }
        // all clear, commit, return true
        $this->db->trans_commit();
        return TRUE;
    }

}
