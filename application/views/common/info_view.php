<?php

echo '<div id="id-div-infoview">';
echo sprintf('<span id="id-span-cu">%s</span>', $this->session->userdata(Constant::SESSION_CURRENTUSER_NAME)); // cu means current users
echo '<span id="id-span-disschange">&#128276;</span>'; // disscussion change listener
echo '</div>';
