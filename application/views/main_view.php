<?php
/**
 * main entry point for all views
 * @author Nyein Chan Aung<developernca@gmail.com>
 */
?>
<html>
    <head>
        <?php
        echo js_tag('https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js');
        echo js_tag(base_url() . 'js/common/common.js');
        if ($is_mobile) {
            echo link_tag(base_url() . 'css/mob/base.css');
            echo js_tag(base_url() . 'js/mob/base.js');
        } else {
            echo link_tag(base_url() . 'css/web/base.css');
            echo js_tag(base_url() . 'js/web/base.js');
        }
        ?>
        <title><?php echo 'XXX'; ?></title>
    </head>
    <body>
        <div id="id-div-maincontainer">
            <?php
            $this->load->view(Constant::HEADER_VIEW);
            if ($view === Constant::WELCOME_VIEW) {
                $this->load->view('common/' . $view);
            } else if ($view === Constant::CONFIRMATION_VIEW) {
                $this->load->view('common/' . $view);
            } else if ($view === Constant::HOME_VIEW) {
                $this->load->view('common/nav_view');
                $this->load->view('common/' . $view);
            } else if ($view === Constant::MY_POST_VIEW) {
                $this->load->view('common/nav_view');
                $this->load->view('common/' . $view);
            }
            ?> 
        </div>
    </body>
</html>