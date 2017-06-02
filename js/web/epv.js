/**
 * @author Nyein Chan Aung<developernca@gmail.com>
 * Separate js file only for each_post_view.php view file.
 * That's why file name is epv.js
 */
var action = "";
$(window).on("load", function () {
    this.action = action;
    setDissInfo();
    gotoUnseen();
    listenThisPostDiscussion();
});

function listenThisPostDiscussion() {
    setInterval(function () {
        $.post(
                action + "index.php/discussionaccess/currentpost_unseen_count/" + $(".cl-span-epid").text(),
                null,
                function (response) {
                    console.log(response);
                });
    }, 2000);
}

function gotoUnseen() {
    // get all discussion p tags
    var discussion_p_list = $(".cl-p-discussion");
    var seen_status = 0;
    var discussion_length = discussion_p_list.length;
    for (var i = 0; i < discussion_length; i++) {
        seen_status = parseInt($(".cl-p-discussion").attr("status"));
        if (seen_status === 0) {
            // scroll to unseen discussions
            var container = $(".cl-p-discussion")[i];
            var position = $(container).position();
            window.scrollTo(0, position.top);
        }
    }
}

function setDissInfo() {
    var info_container = $(".cl-span-dissinfo");
    var temp_container = $(".cl-temp");
    var temp_length = $(temp_container).length;
    for (var i = 0; i < temp_length; i++) {
        console.log($(temp_container[i]).text());
        var info = $(info_container).text().concat(new Date(parseInt($(temp_container[i]).text())));
        $(info_container).text(info);
        $(info_container).show();
        $(temp_container[i]).remove();
    }
}