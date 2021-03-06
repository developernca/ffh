/**
 * author Nyein Chan Aung<developernca@gmail.com>
 */
// =====================================================
/**
 * Initialize all necessary work when loading complete.
 */
var original_container = null;
var edit_container = null;
var action = null; // base url
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const DOW = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
$(window).on("load", function() {
    setPostUpdatedTime();

});
/**
 * Listen discussion change from server.
 *
 * @param {string} action base url
 * @returns {void}
 */
function listenDiscussionChange(action) {
    this.action = action;
    var location = window.location["href"].split("index.php");
    if (location.length > 1 && location[1] !== "") {
        console.log("interval");
        setInterval(function() {
            $.get(
                    action + "index.php/discussionaccess/get_unseen"
                    , null
                    , function(response) {
                        console.log(response);
                        var info_bell_li = $("#id-ul-infoview").find("li"); // use to bind click event to bell icon
                        var resp_arr = JSON.parse(response);
                        if (resp_arr['flg']) {// data exist
                            var data = resp_arr['msg'];
                            var noticount = data.length;
                            if ($("#id-ul-notilist").length < 1) {// first time and noti list not already exist
                                console.log("NULL and generate");
                                $("#id-span-noticount").text(noticount); // append number of notification beside the bell icon
                                generateNotiList(data);
                                $(info_bell_li[1]).on("click", function() {
                                    if ($("#id-ul-notilist").is(":visible")) {
                                        $("#id-ul-notilist").hide(200);
                                    } else {
                                        $("#id-ul-notilist").show(200);
                                    }
                                });
                            } else {
                                var li_list = $("#id-ul-notilist").find("li");
                                if (noticount === li_list.length) {
                                    // same li count, no new notification in other post but there may be changes in
                                    // current posts so change the inner text of li
                                    for (var i = 0; i < li_list.length; i++) {
                                        (data[i]["dcount"] > 1) ?
                                                $(li_list[i]).find(".cl-p-dcount").text("There are " + data[i]["dcount"] + " new discussions in") :
                                                $(li_list[i]).find(".cl-p-dcount").text("There is " + data[i]["dcount"] + " new discussion in")
                                    }
                                } else {// notification changed and the whole noti list must update (regenerate notilist);
                                    $("#id-span-noticount").text(noticount); // append number of notification beside the bell icon
                                    $("#id-ul-notilist").remove();
                                    generateNotiList(data);
                                    $(info_bell_li[1]).off("click");
                                    $(info_bell_li[1]).on("click", function() {
                                        if ($("#id-ul-notilist").is(":visible")) {
                                            $("#id-ul-notilist").hide(200);
                                        } else {
                                            $("#id-ul-notilist").show(200);
                                        }
                                    });
                                }
                            }
                        } else { // no data
                            $("#id-ul-notilist").remove();
                            $("#id-span-noticount").text(null);
                        }
                    });
        }
        , 3000);
    }
}

/**
 * Generate notification list item box.
 *
 * @param {array} data data to display
 * @returns {void}
 */
function generateNotiList(data) {
    var data_length = data.length;
    // ul container
    var ul = $("<ul id='id-ul-notilist'>");
    var each_action = null;
    for (var i = 0; i < data_length; i++) {
        each_action = action + "index.php/each/post/" + data[i]["pid"];
        var link = $("<a style='padding: 0px;text-decoration: none;' href= '" + each_action + "'>");
        var p_title = $("<p class='cl-p-noti cl-p-notititle'>"); // post title
        var p_count = $("<p class='cl-p-noti cl-p-dcount'>"); // discussion count
        $(p_title).text(data[i]["title"]);
        var diss_count = data[i]["dcount"];
        console.log(diss_count);
        if (diss_count > 1) {
            $(p_count).text("There are " + diss_count + " new discussions in");
        } else {
            $(p_count).text("There is " + diss_count + " new discussion in");
        }
        var li = $("<li>");
        $(link).append($(p_count));
        $(link).append($(p_title));
        $(li).append($(link));
        $(ul).append($(li));
    }
    // info view
    var infoview_ul = $("#id-ul-infoview");
    var infoview_position = $(infoview_ul).position();
    var infoview_height = parseInt($(infoview_ul).css("height"));
    // noti view
    $(ul).insertAfter($(infoview_ul));
    $(ul).css("position", "absolute");
    $(ul).css("top", (infoview_position.top + infoview_height) + "px");
    $(ul).css("left", infoview_position.left + "px");
    $(ul).hide();
}

/**
 * Change all time [span] to readable format.
 *
 * @returns {void}
 */
function setPostUpdatedTime() {
    var postedTimeSpan = $(".cl-span-posttime");
    var spanLength = postedTimeSpan.length;
    for (var i = 0; i < spanLength; i++) {
        $(postedTimeSpan[i]).text("last updated : " + getFormattedTime($(postedTimeSpan[i]).text()));
        $(postedTimeSpan[i]).show();
    }
}

/**
 * show or hide navigation container
 *
 * @returns {void}
 */
function toggleNav() {
    var navLinkContaienr = $("#id-ul-navlinkcontainer");
    if (navLinkContaienr.is(":visible")) {
        navLinkContaienr.hide(500);
    } else {
        navLinkContaienr.show(500);
    }
}

/**
 *
 * @param {string} action url
 * @return {void}
 */
function signup(action) {
    toggleAction();
    removeErrSmall();
    var signupAction = action + "index.php/welcome/signup";
    $("#id-hid-sutime").val(new Date().getTime());
    $.post(
            signupAction,
            $("#id-form-signup").serializeArray(),
            function(response) {
                var resp_arr = JSON.parse(response);
                if (resp_arr["flg"] !== 0) {
                    toggleAction();
                    var err_ptag = $("<p>");
                    //$(err_ptag).attr("id", "id-err-signup");
                    $(err_ptag).attr("class", "cl-error-small");
                    $(err_ptag).text(resp_arr["msg"]);
                    $(err_ptag).insertBefore($("#id-btn-suf"));
                } else {
                    $(location).attr("href", action + "index.php/confirmation/");
                }
            }
    );
}

/**
 *
 * @param {type} action url
 * @returns {void}
 */
function signin(action) {
    toggleAction();
    removeErrSmall();
    var signinAction = action + "index.php/welcome/signin";
    $.post(
            signinAction,
            $("#id-form-signin").serializeArray(),
            function(response) {
                toggleAction();
                var resp_arr = JSON.parse(response);
                if (resp_arr["flg"] !== 0) {
                    var err_ptag = $("<p>");
                    //$(err_ptag).attr("id", "id-err-signin");
                    $(err_ptag).attr("class", "cl-error-small");
                    $(err_ptag).text(resp_arr["msg"]);
                    $(err_ptag).insertBefore($("#id-btn-sif"));
                } else {
                    $(location).attr("href", resp_arr["action"]);
                }
            });
}

/**
 * Show password change box when Password forget link is clicked.
 *
 * @param action base_url
 * @returns {void}
 */
function forgetPassClick(action) {
    var modal = $("<div id='id-modal-full'>");
    var container = $("<div id='id-div-passforget'>");
    var title = $("<span id='id-span-passforgettitle'>An auto generated password will send to your mail.<span>");
    var form = $("<form id='id-form-forgetpass'/>");
    var email_field = $("<input type='text' class='cl-text-medium' name='email' size='25' placeholder='Enter your email'/>");
    var submit_btn = $("<input type='button' class='cl-btn-medium' value='Submit'>");
    var cancel_btn = $("<input type='button' class='cl-btn-medium' value='Cancel' style='margin-left: 10px;'>");
    var error_text = $("<span class='cl-error-small'></span>");
    // cancel_btn click
    $(cancel_btn).click(function() {
        $(modal).remove();
    });
    // submit_btn click
    $(submit_btn).click(function() {
        if ($(email_field).val() === "") {
            $(error_text).text("Please, enter your email.");
        } else {
            $.post(
                    action + "index.php/welcome/forget",
                    $("#id-form-forgetpass").serializeArray(),
                    function(response) {
                        var resp_arr = JSON.parse(response);
                        if (resp_arr['flg']) {
                            $("<p>" + resp_arr['msg'] + "</p>").insertBefore($("#id-span-passforget"));
                            console.log(resp_arr);
                            $(modal).remove();
                        } else {
                            $(error_text).text(resp_arr['msg']);
                        }
                    });
        }
    });
    $(container).append($(title));
    $(container).append("<br/>");
    $(form).append($(email_field));
    $(form).append("<br/>");
    $(form).append($(submit_btn));
    $(form).append($(cancel_btn));
    $(container).append($(form));
    $(container).append($(error_text));
    $(modal).append($(container));
    $("body").append($(modal));
}

/**
 * Disable all action elements in welcome view
 * @return void
 */
function toggleAction() {
    var element_list = $(".cl-btn-medium"); //["#id-btn-sif", "#id-btn-suf"];
    for (var i = 0; i < element_list.length; i++) {
        if ($(element_list[i]).prop("disabled")) {
            // disabled to enable (enable)
            $(element_list[i]).addClass("cl-common-hover");
            $(element_list[i]).prop("disabled", false);
        } else {
            // enabled to disable (disable)
            $(element_list[i]).removeClass("cl-common-hover");
            $(element_list[i]).prop("disabled", true);
        }
    }
}

/**
 * Remove error messages
 * @returns {void}
 */
function removeErrSmall() {
    var errors = $(".cl-error-small");
    for (var i = 0; i < errors.length; i++) {
        if (errors[i] !== null) {
            $(errors[i]).remove();
        }
    }
}

/**
 * Send activation code for account activation.
 *
 * @param {object} action url
 * @returns {void}
 */
function sendActcode(action) {
    var activateAction = action + "index.php/confirmation/activate";
    toggleAction();
    removeErrSmall();
    $.post(
            activateAction,
            $("#id-form-actvcode").serializeArray(),
            function(response) {
                var resp_arr = JSON.parse(response);
                if (!resp_arr["flg"]) {
                    var err_ptag = $("<p>");
                    $(err_ptag).attr("class", "cl-error-small");
                    $(err_ptag).text(resp_arr["msg"]);
                    $(err_ptag).insertBefore($("#id-btn-activation"));
                    toggleAction();
                } else {
                    $(location).attr("href", resp_arr["action"]);
                }
            });
}

/**
 * Submit form for email change request.
 *
 * @param {string} base url
 * @returns {void}
 */
function changeEmail(action) {
    $.post(
            action + "index.php/confirmation/change_email/",
            $("#id-form-remail").serializeArray(),
            function(response) {
                console.log(response);
                var resp_arr = JSON.parse(response);
                if (!resp_arr["flg"]) { // flag false, error
                    $("#id-p-cmerror").text(resp_arr["msg"]);
                } else {
                    // clear form and error text
                    $("#id-text-remail").val("");
                    $("#id-p-cmerror").text("");
                    // get email p tag
                    $("#id-p-csinfo").next("p").text(resp_arr["msg"]);
                    // scroll to send confirmation div
                    var container = $("#id-div-confirm");
                    var position = $(container).position();
                    window.scrollTo(0, position.top);
                    // show user to know the latest post signicantlly
                    $(container).fadeTo("slow", 0.5);
                    setTimeout(function() {
                        $(container).stop().fadeTo("slow", 1);
                    }, 2000);
                }
            });
}

/**
 * Create a new post.
 *
 * @param {type} action
 * @returns {undefined}
 */
function submitPost(action) {
    var submitAction = action + "index.php/mypost/submit";
    $("#id-hidden-createdat").val(new Date().getTime());
    $.post(
            submitAction,
            $("#id-form-createpost").serializeArray(),
            function(response) {
                var resp_arr = JSON.parse(response);
                if (resp_arr['flg'] && resp_arr.hasOwnProperty("action")) {// session time out
                    $(location).attr("href", action);
                } else if (resp_arr["flg"] && resp_arr.hasOwnProperty("msg")) { // clear
                    console.log(resp_arr);
                    // post data
                    var pdata = resp_arr["msg"];
                    // create a container div
                    var pcontainer = $("<div class='cl-div-postcontainer'>");
                    // create post title p
                    var ep_title = $("<p class='cl-p-eptitle'>");
                    ep_title.text(pdata["post_title"]);
                    pcontainer.append(ep_title);
                    // create post content p
                    var ep_content = $("<p class='cl-p-epcontent'>");
                    ep_content.html(pdata["post_text_file_name"]);
                    pcontainer.append(ep_content);
                    // create table for contact email, contact phone and remark
                    var rowCount = 0;
                    var table = $("<table border='0' cellpadding='4' cellspacing='0'>");
                    if (pdata["contact_email"] !== null) {
                        table.append($("<tr><td>Contact Email</td><td><span class='cl-span-epcontactemail'>" + pdata["contact_email"] + "</span><td>"));
                        rowCount++;
                    }
                    if (pdata["contact_phone"] !== null) {
                        table.append($("<tr><td>Contact Phone</td><td><span class='cl-span-epcontactphone'>" + pdata["contact_phone"] + "</span><td>"));
                        rowCount++;
                    }
                    if (pdata["remark"] !== null) {
                        table.append($("<tr><td>Remark</td><td><span class='cl-span-epremark'>" + pdata["remark"] + "</span><td>"));
                        rowCount++;
                    }
                    // add row when there is at least one raw
                    if (rowCount > 0) {
                        pcontainer.append($(table));
                    } else {
                        table = null;
                    }
                    // post type and discussion text
                    var post_type = $("<span class='cl-span-posttype' value=''>");
                    $(post_type).text("Type : " + pdata["type"]);
                    $(post_type).attr("value", pdata["type_num"]);
                    var showdiss_text = $("<span class='cl-span-showdiss' value='0' appended='0' onclick=showDiscussion(this,\'" + action + "\');>");
                    $(showdiss_text).text("Show discussion");
                    pcontainer.append($(post_type));
                    pcontainer.append($("<br />"));
                    pcontainer.append($(showdiss_text));
                    // set post id - pid
                    var pid = $("<span name='pid' class='cl-span-epid' style='display:none;'>" + pdata["_id"] + "</span>");
                    pcontainer.append($(pid));
                    // edit button
                    var edt_btn = $("<button class='cl-btn-small cl-btn-epedtbtn' onclick='postEditClick(this)';>&#9998;</button>");
                    var del_btn = $("<button class='cl-btn-small cl-btn-epdelbtn' onclick=postDeleteClick(this,\'" + action + "\');>&#10007;</button>");
                    // delete button
                    pcontainer.append($(edt_btn));
                    pcontainer.append($(del_btn));
                    var pagination_link = $("#id-div-cpcontainer").find("cl-p-paginationlinks");
                    if (pagination_link === null) {
                        pcontainer.insertAfter($("#id-div-cpcontainer"));
                    } else {
                        pcontainer.insertAfter($("#id-div-cpcontainer").next());
                    }
                    // reset data in post create form
                    document.getElementById("id-form-createpost").reset();
                    // scroll to current posted div
                    var container = $(".cl-div-postcontainer")[2];// 0 is search form, 1 is post form
                    var position = $(container).position();
                    window.scrollTo(0, position.top);
                    // show user to know the latest post signicantlly
                    $(container).fadeTo("slow", 0.5);
                    setTimeout(function() {
                        $(container).stop().fadeTo("slow", 1);
                    }, 2000);
                } else if (!resp_arr['flg'] && resp_arr.hasOwnProperty('msg')) { // validation error occured
                    showPostError("#id-p-createposterr", resp_arr['msg']);
                }
            });
}

/**
 * Call when user click post edit button.
 * The fucntion does not submit any data,
 * show only edit form to user.
 *
 * @param {object} element button
 * @returns {void}
 */
function postEditClick(element) {
    // If there is an unfinish edit post, replace that post
    if (edit_container !== null) {
        $(edit_container).replaceWith($(original_container));
    }
    original_container = $(element).parent();
    edit_container = $("#id-div-cpcontainer").clone();
    // replace and add all necessary data
    $(original_container).replaceWith($(edit_container));
    // In each/post page the edit_container is hidden
    if (!$(edit_container).is(":visible")) {
        $(edit_container).show();
    }
    $(edit_container).attr("id", "id-div-epcontainer");
    $(edit_container).find("#id-text-posttitle").val($(original_container).find(".cl-p-eptitle").text());
    $(edit_container).find("#id-textarea-postcontent").val($(original_container).find(".cl-p-epcontent").text());
    $(edit_container).find("#id-text-contactmail").val($(original_container).find(".cl-span-epcontactemail").text());
    $(edit_container).find("#id-text-contactphone").val($(original_container).find(".cl-span-epcontactphone").text());
    $(edit_container).find("#id-text-remark").val($(original_container).find(".cl-span-epremark").text());
    var edit_btn = $(edit_container).find("#id-btn-submitpost");
    console.log(edit_btn);
    $(edit_btn).val("Edit"); // Change button test
    var edit_btn_funcname = $(edit_btn).attr("onclick"); // get onclick event function name
    edit_btn_funcname = edit_btn_funcname.toString().replace("submitPost", "submitEditPost"); // change function name
    $(edit_btn)
            .attr("id", "id-btn-submit-edited-post")
            .attr("onclick", edit_btn_funcname); // set function name
    var form = $(edit_container).find("form");
    $(form).attr("id", "id-form-editpost");
    $(form).append($("<input type='button'>")
            .attr("value", "Cancel")
            .attr("class", "cl-btn-medium cl-common-hover")
            .attr("onclick", "editCancel();"));
    // set select box value
    var original_ptype = $(original_container).find(".cl-span-posttype").attr("value");
    $(edit_container).find("#id-select-type").val(original_ptype);
    // hidden fields
    $(edit_container).find("#id-hidden-createdat").attr("id", "id-hidden-updatedat");
    $(form).append($("<input type='hidden'>").attr("name", "pid").attr("value", ($(original_container).find(".cl-span-epid").text())));
    // change error p tag id
    $(edit_container).find("#id-p-createposterr").attr("id", "id-p-editposterr");
    // show top of the container
    var position = $(edit_container).position();
    window.scrollTo(0, position.top);
}

/**
 * Call when user click delete button. Get id from hidden field of
 * current post and if response flag is true then remove post.
 *
 * @param {Object} element button
 * @param {String} action base url
 * @returns {void}
 */
function postDeleteClick(element, action) {

    var confirm_delete = confirm("Are you sure to delete tihs post");
    if (confirm_delete) {
        var parent_container = $(element).parent();
        var _id = $(parent_container).find(".cl-span-epid").text();
        $.post(
                action + "index.php/mypost/delete/" + _id,
                null,
                function(response) {
                    console.log(response);
                    var resp_arr = JSON.parse(response);
                    if (resp_arr["flg"]) {
                        $(parent_container).remove();
                    }
                });
    }
}

/**
 * Submit user edited data.
 *
 * @param {string} action base_url
 * @returns {void}
 */
function submitEditPost(action) {
    var editAction = action + "index.php/mypost/edit";
    $("#id-hidden-updatedat").val(new Date().getTime());
    $.post(
            editAction,
            $("#id-form-editpost").serializeArray(),
            function(response) {
                console.log(response);
                var resp_arr = JSON.parse(response);
                if (resp_arr['flg'] && resp_arr.hasOwnProperty("action")) {// session time out
                    $(location).attr("href", action);
                } else if (resp_arr["flg"] && resp_arr.hasOwnProperty("msg")) { // clear
                    var data = resp_arr["msg"];
                    $(original_container).find(".cl-p-eptitle").text(data["post_title"]);
                    $(original_container).find(".cl-p-epcontent").html(data["post_content"]);
                    // handle original data
                    var original_table = $(original_container).find("table");
                    var new_table = $("<table>");
                    if ($(original_table).length > 0) {
                        // original table exist and replace with new one
                        $(original_table).replaceWith($(new_table));
                    } else {
                        // original table not exist and insert new one
                        $(original_container).append($(new_table));
                    }
                    // set table data
                    if (data["contact_email"] !== "") {
                        $(new_table).append("<tr>").append("<td>Contact Email</td>").append("<td><span class='cl-span-epcontactemail'>" + data["contact_email"] + "</span></td>");
                    }
                    if (data["contact_phone"] !== "") {
                        $(new_table).append("<tr>").append("<td>Contact Phone</td>").append("<td><span class='cl-span-epcontactphone'>" + data["contact_phone"] + "</span></td > ");
                    }
                    if (data["remark"] !== "") {
                        $(new_table).append("<tr>").append("<td>Remark</td>").append("<td><span class='cl-span-epremark'>" + data["remark"] + "</span></td>");
                    }
                    // set post type
                    $(original_container).find(".cl-span-posttype").text("Type : " + data["type"]);
                    // same logic as edit_cancel button pressed
                    editCancel();
                } else if (!resp_arr["flg"] && resp_arr.hasOwnProperty("msg")) { // validation error occured
                    showPostError("#id-p-editposterr", resp_arr["msg"]);
                }
            });
}

/**
 * Cancel edit process.
 *
 * @returns {void}
 */
function editCancel() {
    $(edit_container).replaceWith($(original_container));
    // scroll to current posted div
    var position = $(original_container).position();
    window.scrollTo(0, position.top);
    // reset containers
    original_container = null;
    edit_container = null;
}

/**
 * Show error message to user when error occur in create or update post.
 *
 * @param {String} id  id of the p tag to display error
 * @param {String} msg error message
 * @returns {void}
 */
function showPostError(id, msg) {
    $(id).text("*** " + msg + "***").fadeIn();
    setTimeout(function() {
        $(id).fadeOut();
    }, 3500);
}

/**
 * Show discussions and discussion form.
 *
 * @param {object} element span tag
 * @param {string} action base url
 * @returns {void}
 */
function showDiscussion(element, action) {
    var parent = $(element).parent();
    var showDissText = $(parent).find(".cl-span-showdiss");
    if ($(showDissText).attr("value") === "0") {
        $(showDissText).text("Hide discussions");
        $(showDissText).attr("value", "1"); // set value to 1, (1 is open, toggle click will hide div)
        $(parent).append(generateDiscussionForm(action));
        $.post(
                action + "index.php/discussionaccess/get/" + $(parent).find(".cl-span-epid").text(),
                null,
                function(response) {
                    var resp_arr = JSON.parse(response);
                    if (resp_arr["flg"] && resp_arr.hasOwnProperty("msg")) {
                        var data = resp_arr["msg"];
                        var cu_id = resp_arr["cu"]; // current user id
                        var data_length = data.length;
                        for (var i = 0; i < data_length; i++) {
                            var view = generateDiscussionView();
                            $(view).find(".cl-p-discussion").html(data[i]["filename"]);
                            // show only if the discussion is posted by current user
                            if (data[i]["discussed_by"] === cu_id) {
                                $(view).find(".cl-span-editdiss").attr("onclick", "dissEditClick(this,\'" + action + "\')");
                                $(view).find(".cl-span-deldiss").attr("onclick", "dissDelClick(this,\'" + action + "\')");
                                $(view).find(".cl-span-dissinfo").text("Discussed by - You - at - " + getFormattedTime(data[i]['updated_at']));
                            } else {
                                $(view).find(".cl-span-editdiss").remove();
                                $(view).find(".cl-span-deldiss").remove();
                                $(view).find(".cl-span-dissinfo").text("Discussed by - " + data[i]["name"] + " - at - " + getFormattedTime(data[i]['updated_at']));
                            }
                            $(view).find(".cl-span-dissid").text(data[i]["_id"]);
                            $(parent).find(".cl-div-disscontainer").append($(view));
                        }
                    }
                });
    } else {
        $(parent).find(".cl-div-disscontainer").hide();
        $(showDissText).attr("value", "0"); // set value to 0, (0 is hide, toggle click will show div)
        $(showDissText).text("Show discussions");
    }
}

/**
 * Create a discussion.
 *
 * @param {string} action base url
 * @param {object} element button
 * @returns {void}
 */
function submitDiscussion(action, element) {
    // get top most parent container of the current post which is div-postcontainer
    var parent = $(element).parent().parent();
    var discussion_text = $(parent).find(".cl-textarea-discussion").val();
    var post_id = $(parent).find(".cl-span-epid").text();
    if (discussion_text !== "") {
        $.post(
                action + "index.php/discussionaccess/submit",
                {"diss": discussion_text, "pid": post_id, "updated_at": new Date().getTime()},
                function(response) {
                    var resp_arr = JSON.parse(response);
                    if (resp_arr["flg"] && resp_arr.hasOwnProperty("msg")) {
                        console.log(resp_arr);
                        var data = resp_arr["msg"];
                        var diss_view = generateDiscussionView();
                        $(diss_view).find(".cl-span-editdiss").attr("onclick", "dissEditClick(this,\'" + action + "\')");
                        $(diss_view).find(".cl-span-deldiss").attr("onclick", "dissDelClick(this,\'" + action + "\')");
                        $(diss_view).find(".cl-p-discussion").html(data["filename"]);
                        $(diss_view).find(".cl-span-dissinfo").text("Discussed by " + data["discussed_by"] + " -at- " + getFormattedTime(data["updated_at"]));
                        $(diss_view).find(".cl-span-dissid").text(data["_id"]);
                        var disscontainer = $(parent).find(".cl-div-disscontainer");
                        $(disscontainer).append(diss_view);
                        // clear discussion text area
                        $(parent).find(".cl-textarea-discussion").val("");
                    }
                });
    }
}

/**
 *
 *
 * @param {object} element edit button
 * @param {string} action base url
 * @returns {void}
 */
function dissEditClick(element, action) {
    var currentDiss = $(element).parent();
    var dissEditForm = generateDiscussionForm(null, false);
    $(dissEditForm).find(".cl-textarea-discussion").val($(currentDiss).find(".cl-p-discussion").text());
    $(currentDiss).replaceWith($(dissEditForm));
    // submit click
    $(dissEditForm).find(".cl-span-dissubmit").on("click", function() {
        var discussion_text = $(dissEditForm).find(".cl-textarea-discussion").val();
        if (discussion_text !== "") {// work only if there is a text in discussion
            var diss_id = $(currentDiss).find(".cl-span-dissid").text();
            $.post(
                    action + "index.php/discussionaccess/edit",
                    {"discussion": discussion_text, "diss_id": diss_id, "updated_at": new Date().getTime()},
                    function(response) {
                        console.log(response);
                        var resp_arr = JSON.parse(response);
                        if (resp_arr["flg"] && resp_arr.hasOwnProperty("msg")) {
                            data = resp_arr["msg"];
                            $(currentDiss).find(".cl-p-discussion").html(data["discussion"]);
                            // set info (discussed user name and time)
                            var info_span = $(currentDiss).find(".cl-span-dissinfo");
                            var info = $(info_span).text().toString().split("at");
                            var name = info[0];
                            var time = getFormattedTime(data["updated_at"]);
                            info = name + " at - " + time;
                            $(info_span).text(info);
                            $(dissEditForm).replaceWith($(currentDiss));
                        } else {
                            $(dissEditForm).replaceWith($(currentDiss));
                        }
                        dissEditForm = null;
                        currentDiss = null;
                    });
        }
    });
    // cancel click
    $(dissEditForm).find(".cl-span-disscancel").on("click", function() {
        $(dissEditForm).replaceWith($(currentDiss));
        dissEditForm = null;
        currentDiss = null;
    });
}

/**
 * Discussion delete button click event.
 *
 * @param {object} element clicked element
 * @param {string} action base_url
 * @returns {void}
 */
function dissDelClick(element, action) {
    var confirm_delete = confirm("Are you sure to delete this discussion?");
    if (confirm_delete) {
        var parent = $(element).parent(); // get current discussion - [cl-div-ediss]
        var did = $(parent).find(".cl-span-dissid").text(); // discussion id
        $.post(
                action + "index.php/discussionaccess/delete/" + did
                , null
                , function(response) {
                    var resp_arr = JSON.parse(response);
                    if (resp_arr["flg"]) { // delete success
                        var each_diss_parent = $(parent).parent(); // for each/post discussions delet
                        $(parent).remove();
                        if ($(each_diss_parent).children().length === 0) {
                            $(each_diss_parent).remove();
                        }
                    } else { // delete failure

                    }
                });
    }
}

/**
 * Template to show discussions.
 * The template will be loaded dynamically.
 */
function generateDiscussionView() {
    var parentContainer = $("<div class='cl-div-ediss'>");
    $(parentContainer)
            .append($("<p class='cl-p-discussion'>"))
            .append($("<span class='cl-accessable cl-span-changediss cl-span-editdiss'>&#9998;</span>"))
            .append($("<span class='cl-accessable cl-span-changediss cl-span-deldiss'>&#10007;</span>"))
            .append($("<span class='cl-span-dissinfo'>"))
            .append($("<span class='cl-span-dissid' style='display: none;'>"));
    return $(parentContainer);
}

/**
 * Dynamically create a div for discussion form.
 *
 * @param {string} action base url
 * @param {boolean} create_mode create or edit
 * @returns {object} created div
 */
function generateDiscussionForm(action, create_mode = true) {
    var container_div = $("<div class='cl-div-disscontainer'>");
    var text_area = $("<textarea class='cl-textarea-discussion' rows=4 placeholder='Your discussion may be a good hlep...'>");
    $(container_div).append($(text_area));
    $(container_div).append($("<br/>"));
    if (create_mode) {
        var submit_button = $("<span class='cl-accessable cl-span-changediss cl-span-dissubmit'>Submit</button>");
        $(submit_button).attr("onclick", "submitDiscussion(\'" + action + "\', this);");
        $(container_div).append($(submit_button));
    } else {
        var submit_button = $("<button class='cl-accessable cl-span-changediss cl-span-dissubmit'>Submit</button>");
        var cancel_button = $("<button class='cl-accessable cl-span-changediss cl-span-disscancel'>Cancel</button>");
        $(container_div).append($(submit_button));
        $(container_div).append($(cancel_button));
    }
    return $(container_div);
}

/**
 * Change milliseconds to desired time format.
 *
 * @param {type} milli time in milli
 * @returns {String} formatted time
 */
function getFormattedTime(milli) {
    var milliTime = parseInt(milli);
    var date = new Date(milliTime);
    var day = date.getFullYear() + " " + MONTHS[date.getMonth()] + " " + date.getDate() + " " + DOW[date.getDay()];
    var min = date.getMinutes();
    var hr = date.getHours();
    // put zero if there is only one digit to get hh:mm format
    var time = ((hr > 9) ? hr : ("0" + hr)) + ":" + ((min > 9) ? min : ("0" + min));
    return day + "  " + time;
}