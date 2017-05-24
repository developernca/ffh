/**
 * author Nyein Chan Aung<developernca@gmail.com>
 */
var original_container = null;
var edit_container = null;
/**
 * Initialize all necessary work when loading complete.
 */
$(window).on("load", function () {
    setPostUpdatedTime();
    navChange();
});

/**
 * change current link to green color and black text
 * in navi ul-li
 *
 * @returns {void}
 */
function navChange() {
    var ul_elements = $("#id-ul-navlinkcontainer").children("li");
    var ul_length = ul_elements.length;
    var current_url = window.location.href;
    for (var i = 0; i < ul_length; i++) {
        var li = ul_elements[i];
        var a_tag = $(li).find("a");
        var url = a_tag.attr("href");
        if (url === current_url) {
            a_tag.css("color", "#000000");
            $(li).css("background", "green");
            break;
        }
    }
}

function setPostUpdatedTime() {
    var postedTimeSpan = $(".cl-span-posttime");
    var spanLength = postedTimeSpan.length;
    for (var i = 0; i < spanLength; i++) {
        var time = new Date(parseInt($(postedTimeSpan[i]).text()));
        $(postedTimeSpan[i]).text("last updated : " + time.toString()).show();
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
            function (response) {
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
            function (response) {
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
 * Disable all action elements in welcome view
 * @return void
 */
function toggleAction() {
    var element_list = $(".cl-btn-medium");//["#id-btn-sif", "#id-btn-suf"];
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
            function (response) {
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
            function (response) {
                var resp_arr = JSON.parse(response);
                if (resp_arr['flg'] && resp_arr.hasOwnProperty("action")) {// session time out
                    $(location).attr("href", action);
                } else if (resp_arr["flg"] && resp_arr.hasOwnProperty("msg")) { // clear
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
                        pcontainer.append(table);
                    } else {
                        table = null;
                    }
                    // edit button
                    var edt_btn = $("<button class='cl-btn-small cl-btn-epedtbtn' onclick='postEditClick(this)';>&#9998;</button>");
                    var del_btn = $("<button class='cl-btn-small cl-btn-epdelbtn' onclick='post_delete_clik(this);'>&#10007;</button>");
                    // delete button
                    pcontainer.append(edt_btn);
                    pcontainer.append(del_btn);
                    pcontainer.insertAfter($("#id-div-cpcontainer"));
                    // reset data in post create form
                    document.getElementById("id-form-createpost").reset();
                    // scroll to current posted div
                    var container = $(".cl-div-postcontainer")[1];
                    var position = $(container).position();
                    window.scrollTo(0, position.top);
                    // show user to know the latest post signicantlly
                    $(container).fadeTo("slow", 0.5);
                    setTimeout(function () {
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
    $(edit_container).attr("id", "id-div-epcontainer");
    $(edit_container).find("#id-text-posttitle").val($(original_container).find(".cl-p-eptitle").text());
    $(edit_container).find("#id-textarea-postcontent").val($(original_container).find(".cl-p-epcontent").text());
    $(edit_container).find("#id-text-contactmail").val($(original_container).find(".cl-span-epcontactemail").text());
    $(edit_container).find("#id-text-contactphone").val($(original_container).find(".cl-span-epcontactphone").text());
    $(edit_container).find("#id-text-remark").val($(original_container).find(".cl-span-epremark").text());
    var edit_btn = $(edit_container).find("#id-btn-submitpost");
    $(edit_btn).val("Edit");// Change button test
    var edit_btn_funcname = $(edit_btn).attr("onclick");// get onclick event function name
    edit_btn_funcname = edit_btn_funcname.toString().replace("submitPost", "submitEditPost");// change function name
    $(edit_btn)
            .attr("id", "id-btn-submit-edited-post")
            .attr("onclick", edit_btn_funcname);// set function name
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
                function (response) {
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
            function (response) {
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
    setTimeout(function () {
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
        $(showDissText).attr("value", "1");// set value to 1, (1 is open, toggle click will hide div)
        $(parent).append(generateDiscussionBox(action));
        $.post(
                action + "index.php/discussionaccess/get/" + $(parent).find(".cl-span-epid").text(),
                null,
                function (response) {
                    var resp_arr = JSON.parse(response);
                    if (resp_arr["flg"] && resp_arr.hasOwnProperty("msg")) {
                        var data = resp_arr["msg"];
                        var data_length = data.length;
                        console.log(data_length);
                        for (var i = 0; i < data_length; i++) {
                            $(showDissText).text(data[i]["name"]);
                            console.log(data[i]["name"]);
                        }
                    }
                });
    } else {
        $(parent).find(".cl-div-disscontainer").hide();
        $(showDissText).attr("value", "0");// set value to 0, (0 is hide, toggle click will show div)
        $(showDissText).text("Show discussions");
    }
}

/**
 * Dynamically create a div for discussions and discussion form.
 *
 * @param {string} action base url
 * @returns {object} created div
 */
function generateDiscussionBox(action) {
    var container_div = $("<div class='cl-div-disscontainer'>");
    var text_area = $("<textarea class='cl-textarea-discussion' rows=4>");
    var submit_button = $("<button class='cl-btn-dissubmit'>Submit</button>");
    $(submit_button).attr("onclick", "submitDiscussion(\'" + action + "\', this);");
    $(container_div).append($(text_area));
    $(container_div).append($("<br/>"));
    $(container_div).append($(submit_button));
    return $(container_div);
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
                {"diss": discussion_text, "pid": post_id, "updated": new Date().getTime()},
                function (response) {
                    //var resp_arr = JSON.parse(response);
                });
    }
}