<pre id="id-pre-desc">
KJB is a bulletin-board system.
Ask questions you want to know,
Advertise items wanted or for sale,
Post vacancy announcement and many other.
</pre>
<?php
// ==================== Sign in form ====================

echo '<form id="id-form-signin">';

echo form_input([
    'class' => 'cl-text-medium',
    'id' => 'id-text-sifemail',
    'name' => Constant::NAME_TEXT_SIGNIN_FORM_EMAIL,
    'size' => 25,
    'placeholder' => 'Enter email'
]);

echo br();

echo form_input([
    'type' => 'password',
    'class' => 'cl-text-medium',
    'id' => 'id-pass-sifpass',
    'name' => Constant::NAME_PASS_SIGNIN_FORM_PASSWORD,
    'size' => 25,
    'placeholder' => 'Enter password'
]);

echo br();

echo form_input([
    'type' => 'button',
    'class' => 'cl-btn-medium cl-common-hover',
    'id' => 'id-btn-sif',
    'name' => Constant::NAME_BTN_SIGNIN_FORM,
    'onclick' => 'signin(\'' . base_url() . '\');']
        , 'Sign In');

echo '</form>';

echo anchor('#', Constant::TEXT_FORGET_PASSWORD_LINK, ["id" => "id-link-passforget"]);

// ==================== Sign up form ====================

echo '<form id="id-form-signup">';

echo form_input([
    'class' => 'cl-text-medium',
    'id' => 'id-text-sufemail',
    'name' => Constant::NAME_TEXT_SIGNUP_FORM_EMAIL,
    'size' => 25,
    'placeholder' => 'Enter email'
]);

echo br();

echo form_input([
    'type' => 'password',
    'class' => 'cl-text-medium',
    'id' => 'id-pass-sufpass',
    'name' => Constant::NAME_PASS_SIGNUP_FORM_PASSWORD,
    'size' => 25,
    'placeholder' => 'Enter password'
]);

echo br();

echo form_input([
    'type' => 'password',
    'class' => 'cl-text-medium',
    'id' => 'id-pass-sufrepass',
    'name' => Constant::NAME_PASS_SIGNUP_FORM_REPASSWORD,
    'size' => 25,
    'placeholder' => 'Re-enter password'
]);

echo br();

echo form_input([
    'type' => 'button',
    'class' => 'cl-btn-medium cl-common-hover',
    'id' => 'id-btn-suf',
    'name' => Constant::NAME_BTN_SIGNUP_FORM,
    'style' => 'margin-bottom: 10px;',
    'onclick' => 'signup(\'' . base_url() . '\');'], 'Sign Up');

echo form_input([
    'type' => 'hidden',
    'id' => 'id-hid-sutime',
    'name' => Constant::NAME_HIDDEN_SIGNUP_TIME]);

echo '</form>';
