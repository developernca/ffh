<?php

/**
 * Constants for the whole application.
 */
class Constant {

    // ===== View name constants =====
    const WELCOME_VIEW = 'welcome_view';
    const HEADER_VIEW = 'header_view';
    const CONFIRMATION_VIEW = 'confirmation_view';
    const HOME_VIEW = 'home_view';
    const MY_POST_VIEW = 'mypost_view';
    const SESSION_USSID = 'sussid';
    const SESSION_EMAIL = 'email';
    // ===== AUTHANTICATION CODE =====
    const AUTH_ALREADY_LOGIN = 'alr_lgin'; // already logged in [authentication OK]
    const AUTH_SESSION_NOT_EXIST = 'no_sess'; // session not exist 
    const AUTH_ACTIVATION_REQUIRED = 'act_req'; // activation require
    // ===== ERROR MESSAGES =====
    const ERR_EMAIL_FORMAT = 'Incorrect email format';
    const ERR_SIGNUP_EMAIL_EXIST = 'The email address is already registered';
    const ERR_SIGNUP_PASS_LENTH = 'Password must be at least 6 characters';
    const ERR_SIGNUP_PASS_MISMATCH = 'Password did not match';
    const ERR_EMAIL_BLANK = 'Email cannot be blank';
    const ERR_EMAIL_EXCEED_LENGTH = 'Email cannot exceed 200 characters.';
    const ERR_PASSWORD_BLANK = 'Password cannot be blank';
    const ERR_PASSWORD_LENGTH = 'Password must be greater than 5 characters';
    const ERR_BLANK_ACTCODE = 'Please enter activation code.';
    const ERR_LONGER_ACTCODE = 'Activation code has to be excatly 6 characters';
    const ERR_ACTVCODE_MISMATCH = 'Activation code did not match';
    const ERR_ACTVCODE_UPDATE = 'Sorry, unexpected error occured during activation process. Try again or click resend link.';
    // ===== NAME ATTRIBUTE CONSTANTS FOR HTML TAG =====
    // name for input text field
    const NAME_TEXT_SIGNIN_FORM_EMAIL = 'sif_email';
    const NAME_TEXT_SIGNUP_FORM_EMAIL = 'suf_email';
    const NAME_TEXT_ACTIVATION_CODE = 'actv_code';
    const NAME_TEXT_RESEND_EMAIL = 're_email';
    const NAME_TEXT_POST_TITLE = 'post_title';
    const NAME_TEXT_POST_CONTENT = 'post_content';
    const NAME_TEXT_CONTACT_EMAIL = 'contact_email';
    const NAME_TEXT_CONTACT_PHONE = 'contact_phone';
    const NAME_TEXT_POST_REMARK = 'remark';
    // name for input password field
    const NAME_PASS_SIGNIN_FORM_PASSWORD = 'sif_pass';
    const NAME_PASS_SIGNUP_FORM_PASSWORD = 'suf_passs';
    const NAME_PASS_SIGNUP_FORM_REPASSWORD = 'suf_repass';
    // name for input button field
    const NAME_BTN_SIGNIN_FORM = 'sif_btn';
    const NAME_BTN_SIGNUP_FORM = 'suf_btn';
    // name for hidden field
    const NAME_HIDDEN_SIGNUP_TIME = 'suf_usr_time';
    const NAME_HIDDEN_POST_CREATEDAT = 'pcf_created_time';
    const NAME_HIDDEN_POST_UPDATEDAT = 'pcf_updated_time';
    // name for select field
    const NAME_SELECT_POST_TYPE = 'type';
    // database table and column name
    // ACCOUNTS TABLE
    const TABLE_ACCOUNTS = 'accounts';
    const TABLE_ACCOUNTS_COLUMN_ID = '_id';
    const TABLE_ACCOUNTS_COLUMN_EMAIL = 'email';
    const TABLE_ACCOUNTS_COLUMN_NAME = 'name';
    const TABLE_ACCOUNTS_COLUMN_PASSWORD = 'password';
    const TABLE_ACCOUNTS_COLUMN_CREATEDTIME = 'created_time';
    const TABLE_ACCOUNTS_COLUMN_NUMBEROF_USER = 'number_of_user';
    const TABLE_ACCOUNTS_COLUMN_IS_ACTIVATED = 'is_activated';
    const TABLE_ACCOUNTS_COLUMN_ACTIVATION_CODE = 'activation_code';
    //
    // POSTS TABLE
    const TABLE_POSTS = 'posts';
    const TABLE_POSTS_COLUMN_ID = '_id';
    const TABLE_POSTS_COLUMN_POST_TITLE = 'post_title';
    const TABLE_POSTS_COLUMN_TEXT_FILENAME = 'post_text_file_name';
    const TABLE_POSTS_COLUMN_CONTACT_EMAIL = 'contact_email';
    const TABLE_POSTS_COLUMN_CONTACT_PHONE = 'contact_phone';
    const TABLE_POSTS_COLUMN_REMARK = 'remark';
    const TABLE_POSTS_COLUMN_TYPE = 'type';
    const TABLE_POSTS_COLUMN_POSTED_TIME = 'posted_time';
    const TABLE_POSTS_COLUMN_UPDATED_TIME = 'updated_time';
    const TABLE_POSTS_COLUMN_ACCOUNT_ID = 'account_id';
    // =============== VIEW DATA KEY NAME ===================
    const VDN_POST_TYPES_OPTIONS = 'vdn_post_types_options';
    const VDN_CURRENTUSER_POST_LISTS = 'vdn_current_user_post_lists';
    // text
    const TEXT_FORGET_PASSWORD_LINK = 'Forgot password?';
    // Type options array
    const POST_TYPE_OPTIONS_ARR = [
        'IT_Computing',
        'Politic',
        'Business',
        'Other',
        'Research',
        'Engineering'
    ];

}
