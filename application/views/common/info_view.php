<?php

echo '<br/>';
$info_list = [
    $this->session->userdata(Constant::SESSION_CURRENTUSER_NAME),
    '&#128276;'
];
echo ul($info_list, ['id' => 'id-ul-infoview']);
echo '<br/>';
