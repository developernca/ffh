/**
 * @author Nyein Chan Aung<developernca@gmail.com>
 * Separate js file only for each_post_view.php view file.
 * That's why file name is epv.js
 */
var action = "";
$(window).on("load", function() {
    this.action = action;
    setDissInfo();
    gotoUnseen();
    listenThisPostDiscussion();
});

function listenThisPostDiscussion() {
    setInterval(function() {
        // In normal case the id is text, in edit case the id is value of span
        // @see common.js/postEditClick();
        var id = $(".cl-span-epid").text() === "" ? $("input[type=hidden][name=pid]").val() : $(".cl-span-epid").text();
        $.post(
                action + "index.php/discussionaccess/currentpost_unseen_count/" + id,
                null,
                function(response) {
                    console.log(response);
                    var resp_arr = JSON.parse(response);
                    if (resp_arr["flg"]) {
                        var count = resp_arr["msg"];
                        var alert_text = "";
                        if (count > 1) {
                            alert_text = "There are " + count + " new discussions in this post. Click to refresh!";
                        } else {
                            alert_text = "There is 1 new discussion in this post. Click to refresh!";
                        }
                        var container = $("#id-p-eachalert");
                        if ($(container).length === 0) {
                            container = $("<p id='id-p-eachalert'></p>");
                            $(container).append("<span>");
                        }
                        $(container).children().text(alert_text);
                        $(container).children().css("cursor", "pointer");
                        $(container).children().click(function() {
                            location.reload();
                        });
                        $(container).insertAfter($(".cl-div-postcontainer")[0]);
                    }

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
        var info = $(info_container[i]).text();
        info += getFormattedTime($(temp_container[i]).text());
        $(info_container).text(info);
        $(info_container).show();
        $(temp_container[i]).remove();
        break;
    }
}