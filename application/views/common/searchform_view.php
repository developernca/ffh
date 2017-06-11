<?php

echo '<div id="id-div-searchbar" class="cl-div-postcontainer">';

echo form_open(base_url() . 'index.php/home/search', ['id' => 'id-form-search', 'method' => 'get']);
echo form_input([
    'id' => 'id-text-searchkey',
    'class' => 'cl-text-medium',
    'placeholder' => 'Search...',
    'name' => Constant::NAME_TEXT_SEARCH_KEY,
]);
echo '<br/>';
echo form_dropdown([
    'type' => 'select',
    'id' => 'id-select-searchtype',
    'class' => 'cl-select-large',
    'name' => Constant::NAME_SELECT_POST_TYPE,
        ], ${Constant::VDN_POST_TYPES_OPTIONS});
echo '<br>';
echo form_input([
    'type' => 'submit',
    'class' => 'cl-btn-medium',
    'value' => 'Search'
]);
echo form_close();

echo '</div>';
