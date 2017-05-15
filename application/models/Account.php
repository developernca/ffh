<?php

class Account extends CI_Model {

    public function __construct() {
        parent::__construct();
    }

    /**
     * Save data to accounts table. 
     * 
     * @param type $data sign up form data
     * @return mixed return current inserted _id if registration success, null otherwise
     */
    public function register($data) {
        // generate user id
        $usr_id = null;
        do {
            $usr_id = KeyGenerator::getAlphaNumString(10, true, true);
            $query = $this->db->get_where(Constant::TABLE_ACCOUNTS, [Constant::TABLE_ACCOUNTS_COLUMN_ID => $usr_id]);
            $result = $query->result();
        } while (!empty($result));
        mkdir(FCPATH . DIRECTORY_SEPARATOR . $usr_id);

        // generate activation code
        do {
            $activation_code = KeyGenerator::getAlphaNumString(6);
            $query = $this->db->get_where(Constant::TABLE_ACCOUNTS, [Constant::TABLE_ACCOUNTS_COLUMN_ACTIVATION_CODE => $activation_code]);
            $result = $query->result();
        } while (!empty($result));

        $hashed_password = password_hash($data[Constant::NAME_PASS_SIGNUP_FORM_PASSWORD], PASSWORD_DEFAULT);
        $usr_name = explode('@', $data[Constant::NAME_TEXT_SIGNUP_FORM_EMAIL]);
        $values = [
            Constant::TABLE_ACCOUNTS_COLUMN_ID => $usr_id
            , Constant::TABLE_ACCOUNTS_COLUMN_EMAIL => $data[Constant::NAME_TEXT_SIGNUP_FORM_EMAIL]
            , Constant::TABLE_ACCOUNTS_COLUMN_NAME => $usr_name[0]
            , Constant::TABLE_ACCOUNTS_COLUMN_PASSWORD => $hashed_password
            , Constant::TABLE_ACCOUNTS_COLUMN_CREATEDTIME => $data[Constant::NAME_HIDDEN_SIGNUP_TIME]
            , Constant::TABLE_ACCOUNTS_COLUMN_NUMBEROF_USER => NULL
            , Constant::TABLE_ACCOUNTS_COLUMN_IS_ACTIVATED => FALSE
            , Constant::TABLE_ACCOUNTS_COLUMN_ACTIVATION_CODE => $activation_code];
        $insert_success = $this->db->insert(Constant::TABLE_ACCOUNTS, $values);
        if ($insert_success) {
            return $usr_id;
        } else {
            return null;
        }
    }

    /**
     * Test whether sign up email already exist.
     * 
     * @param type $email sign up form email
     * @return boolean true if email exist, false otherwise
     */
    public function is_email_exist($email) {
        $query = $this->db->get_where(Constant::TABLE_ACCOUNTS, [Constant::TABLE_ACCOUNTS_COLUMN_EMAIL => $email]);
        $result = $query->result();
        return empty($result) ? FALSE : TRUE;
    }

    /**
     * Check whether current user activated his/her
     * account.
     * 
     * @param type $cussid string
     * @param type $email string
     * @return boolean true if current account is activated, false otherwise
     */
    public function is_activated($cussid, $email) {
        $query = $this->db->get_where(Constant::TABLE_ACCOUNTS, [Constant::TABLE_ACCOUNTS_COLUMN_ID => $cussid, Constant::TABLE_ACCOUNTS_COLUMN_EMAIL => $email, Constant::TABLE_ACCOUNTS_COLUMN_IS_ACTIVATED => TRUE]);
        $result = $query->result();
        return empty($result) ? FALSE : TRUE;
    }

    /**
     * Activate current account, if id and code are correct.
     * 
     * @param string $id account id 
     * @param string $code activation code
     * @return mixed
     */
    public function activate_account($id, $email, $code) {
        $this->db->where(Constant::TABLE_ACCOUNTS_COLUMN_ID, $id);
        $this->db->where(Constant::TABLE_ACCOUNTS_COLUMN_ACTIVATION_CODE, $code);
        $result = $this->db->update(Constant::TABLE_ACCOUNTS, [Constant::TABLE_ACCOUNTS_COLUMN_IS_ACTIVATED => TRUE]);
        if ($result) {
            return $this->is_activated($id, $email);
        } else {
            return null;
        }
    }

    /**
     * Check whether sign in form email and password match with existed data in database.
     *
     * @param string $email submitted sign in form email
     * @param string $password submitted sign in form password
     * @return mixed return null if email and password did not match, _id otherwise
     */
    public function is_signin_correct($email, $password) {
        $this->db->select(Constant::TABLE_ACCOUNTS_COLUMN_PASSWORD);
        $query = $this->db->get_where(Constant::TABLE_ACCOUNTS, [Constant::TABLE_ACCOUNTS_COLUMN_EMAIL => $email]);
        $result = $query->result_array();
        if (count($result) == 1) { // password matching
            return password_verify($password, $result[0][Constant::TABLE_ACCOUNTS_COLUMN_PASSWORD]) ? $this->get_acc_by_email($email, [Constant::TABLE_ACCOUNTS_COLUMN_ID]) : NULL;
        } else { // email did not match
            return NULL;
        }
    }

    private function get_acc_by_email($email, array $column = null) {
        $this->db->select(implode(',', $column));
        $query = $this->db->get_where(Constant::TABLE_ACCOUNTS, [Constant::TABLE_ACCOUNTS_COLUMN_EMAIL => $email]);
        $result = $query->result_array();
        return $result[0][Constant::TABLE_ACCOUNTS_COLUMN_ID];
    }

}
