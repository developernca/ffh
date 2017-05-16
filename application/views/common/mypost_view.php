<?php

echo '<br/>';
// =========== begin create post container ============
echo '<div id = "id-div-cpcontainer" class = "cl-div-postcontainer">';
// =========== end create post form ===================
echo '<form id = "id-form-createpost">';
echo form_input([
    'type' => 'text',
    'id' => 'id-text-posttitle',
    'class' => 'cl-text-medium',
    'name' => Constant::NAME_TEXT_POST_TITLE,
    'placeholder' => 'What kind of help do you need..',
    'style' => 'width: 90%;'
]);
echo form_textarea([
    'id' => 'id-textarea-postcontent',
    'name' => Constant::NAME_TEXT_POST_CONTENT,
    'rows' => 12,
    'placeholder' => 'How can other people help you...'
]);
echo '<br/>';
echo form_input([
    'type' => 'text',
    'id' => 'id-text-contactmail',
    'class' => 'cl-text-medium',
    'name' => Constant::NAME_TEXT_CONTACT_EMAIL,
    'placeholder' => 'Contact email (optional)',
    'style' => 'width: 55%;'
]);
echo '<br/>';
echo form_input([
    'type' => 'text',
    'id' => 'id-text-contactphone',
    'class' => 'cl-text-medium',
    'name' => Constant::NAME_TEXT_CONTACT_PHONE,
    'placeholder' => 'Contact phone (optional)',
    'style' => 'width: 55%;'
]);
echo '<br/>';
echo form_input([
    'type' => 'text',
    'id' => 'id-text-remark',
    'class' => 'cl-text-medium',
    'name' => Constant::NAME_TEXT_POST_REMARK,
    'placeholder' => 'Remark (optional)',
    'style' => 'width: 55%;'
]);
echo '<br/>';
echo form_label('Choose type of your request : ');
echo form_dropdown([
    'type' => 'select',
    'id' => 'id-select-type',
    'class' => 'cl-select-large',
    'name' => Constant::NAME_SELECT_POST_TYPE,
    ], ${Constant::VDN_POST_TYPES_OPTIONS});
echo '<br/>';
echo form_input([
    'type' => 'button',
    'id' => 'id-text-remark',
    'class' => 'cl-btn-medium cl-common-hover',
    'value' => 'Submit',
    'onclick' => 'submitPost(\'' . base_url() . '\');'
]);
echo form_input([
    'type' => 'hidden',
    'id' => 'id-hidden-createdat',
    'name' => Constant::NAME_HIDDEN_POST_CREATEDAT
]);
echo '</form>';
// =========== end create post form ===================
// =========== begin post error p tag =================
echo '<p id="id-p-createposterr" class="cl-p-posterr"></p>';
// =========== end post error p tag==================
echo '</div>';
// =========== end create post container ==================
//
//
//
//
//
//
//
//
// =========== begin current users post lit ================
$post_list = ${Constant::VDN_CURRENTUSER_POST_LISTS};
if (!is_null($post_list)) {
    foreach ($post_list as $column => $row) {
        echo '<div class="cl-div-postcontainer">';
        echo '<p>' . $row[Constant::TABLE_POSTS_COLUMN_POST_TITLE] . '</p>';
        echo '<p>' . $row[Constant::TABLE_POSTS_COLUMN_TEXT_FILENAME] . '</p>';
        echo '</div>';
    }
}

