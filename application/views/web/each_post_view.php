<?php

// result set data row -> [0][post_title, post_text, etc, ...]
$row = ${Constant::VDN_EACH_POST}[0];
// ==================== Begin post conatiner ==============================
echo '<div class="cl-div-postcontainer">';
echo '<p class="cl-p-eptitle">' . $row[Constant::TABLE_POSTS_COLUMN_POST_TITLE] . '</p>';
// post updated time
echo sprintf('<span class="cl-span-posttime">%s</span>', $row[Constant::TABLE_POSTS_COLUMN_UPDATED_TIME]);
// posted user, if the post is updated by current user show you, name otherwise
if ($row[Constant::TABLE_POSTS_COLUMN_ACCOUNT_ID] == $this->session->userdata(Constant::SESSION_USSID)) {
    echo sprintf('<span class="cl-span-postedby">%s</span>', 'Your post');
} else {
    echo sprintf('<span class="cl-span-postedby">%s</span>', $row[Constant::TABLE_ACCOUNTS_COLUMN_NAME]);
}
echo '<p class="cl-p-epcontent">' . $row[Constant::TABLE_POSTS_COLUMN_TEXT_FILENAME] . '</p>';
if (!is_null($row[Constant::TABLE_POSTS_COLUMN_CONTACT_PHONE])) {
    $this->table->add_row('Contact Phone', '<span class="cl-span-epcontactphone">' . $row[Constant::TABLE_POSTS_COLUMN_CONTACT_PHONE] . '</span>');
}
if (!is_null($row[Constant::TABLE_POSTS_COLUMN_REMARK])) {
    $this->table->add_row('Remark', '<span class="cl-span-epremark">' . $row[Constant::TABLE_POSTS_COLUMN_REMARK] . '</span>');
}
$table = $this->table->generate();
if (strcasecmp($table, "Undefined table data") !== 0) {
    echo $table;
}
// post id
echo sprintf('<span name=%s class="cl-span-epid" style="display:none;">%s</span>', Constant::NAME_HIDDEN_POST_ID, $row[Constant::TABLE_POSTS_COLUMN_ID]);
// Edit and delete button is shown only if the post is the current user post
if ($row[Constant::TABLE_POSTS_COLUMN_ACCOUNT_ID] == $this->session->userdata(Constant::SESSION_USSID)) {
    // edit
    echo '<button class="cl-btn-small cl-btn-epedtbtn" onclick="postEditClick(this);" />&#9998;</button>';
    // delete
    echo sprintf('<button class="cl-btn-small cl-btn-epdelbtn" onclick="postDeleteClick(this,\'%s\');" />&#10007;</button>', base_url());
}
// post type
echo sprintf('<span class="cl-span-posttype" value="%s"/>Type : %s</span>', array_search($row[Constant::TABLE_POSTS_COLUMN_TYPE], ${Constant::VDN_POST_TYPES_OPTIONS}), $row[Constant::TABLE_POSTS_COLUMN_TYPE]);
echo '<br />';
echo '</div>';
// ==================== End post conatiner ==============================
//
//
// ==================== Begin discussion list ===========================
$discussion_lists = ${Constant::VDN_DISCUSSION_LIST_EACH};
foreach ($discussion_lists as $value) {
    echo '<div class="cl-div-postcontainer">';
    echo '<div class="cl-div-ediss">';
    echo sprintf('<p class="cl-p-discussion" status="%s">%s</p>', $value[Constant::TABLE_DISCUSSION_COLUMN_SEEN], $value[Constant::TABLE_DISCUSSION_COLUMN_FILENAME]);
    if ($value[Constant::TABLE_DISCUSSION_COLUMN_DISCUSSEDBY] === $this->session->userdata(Constant::SESSION_USSID)) {
        echo sprintf('<span class="cl-accissable cl-span-changediss cl-span-editdiss">%s</span>', '&#9998');
        echo sprintf('<span class="cl-accissable cl-span-changediss cl-span-deldiss>%s</span>', '&#10007');
    }
    echo sprintf('<span class="cl-span-dissinfo" style="display:none;">Discussed by - %s - at - </span>', $value[Constant::TABLE_ACCOUNTS_COLUMN_NAME]);
    echo sprintf('<span class="cl-temp">%s</span>', $value[Constant::TABLE_DISCUSSION_COLUMN_UPDATEDAT]);
    echo sprintf('<span class="cl-span-dissid" style="display:none;">%s</span>', $value[Constant::TABLE_DISCUSSION_COLUMN_ID]);
    echo '</div>';
    echo '</div>';
}
// ==================== End discussion list ===========================
