<?php

echo '<div id="id-div-navcontainer">'; // begin navication container div

echo '<p onclick="toggleNav();">';
echo img('usr/arrow.png');
echo '</p>';

$nav_list = [
    anchor(base_url() . 'index.php/home/signout', 'Sign Out'),
    anchor(base_url() . 'index.php/mypost', 'My Posts'),
    anchor(base_url() . 'index.php/home/', 'Home'),
    "Setting"
];
echo ul($nav_list, ['id' => 'id-ul-navlinkcontainer']);

echo '</div>'; // end navication container div