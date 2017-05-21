<?php

echo '<div>';
echo '<p>';
echo anchor(base_url() . 'index.php/confirmation/signout', 'Sign Out', ['class' => 'cl-link-signout']);
echo '</p>';
// =========== CONFIRM ===========
echo '<div class="cl-div-confirmation" id="id-div-confirm">'; // begin confirmation div

echo '<p id="id-p-csinfo">A 6 digits activation code was sent to,</p>';
echo sprintf('<p style="color: #0000FF;"> %s </p>', ${Constant::VDN_SESSION_EMAIL});

echo '<form id="id-form-actvcode">';

echo form_input([
    'class' => 'cl-text-medium',
    'id' => 'id-text-activation',
    'name' => Constant::NAME_TEXT_ACTIVATION_CODE,
    'size' => 25,
    'placeholder' => 'Enter activation code'
]);

echo '<br />';

echo form_input([
    'type' => 'button',
    'class' => 'cl-btn-medium',
    'id' => 'id-btn-activation',
    'onclick' => 'sendActcode(\'' . base_url() . '\');'
    ], 'Activate');

echo '</form>';

echo anchor('#', 'Did not receive code? Resend code...', ['id' => 'id-link-rscode']);

echo '</div>'; // end of confirmation div

echo '<br />';

// =========== EMAIL RESEND ======

echo '<div class="cl-div-confirmation" id="id-div-mresend">'; // begin email resend div

echo '<p id="id-p-iminfo">Enter invalid email address?</p>';

echo '<form id="id-form-remail">';

echo form_input([
    'class' => 'cl-text-medium',
    'id' => 'id-text-remail',
    'name' => Constant::NAME_TEXT_RESEND_EMAIL,
    'size' => 25,
    'placeholder' => 'Enter email'
]);

echo '<br />';

echo form_input([
    'type' => 'button',
    'class' => 'cl-btn-medium',
    'id' => 'id-btn-remail',
    'onclick' => 'resend_email(this);'
    ], 'Send');

echo '</form>';

echo '</div>'; // end of email resend div

echo '</div>';
