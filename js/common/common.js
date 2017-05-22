/**
 * author Nyein Chan Aung<developernca@gmail.com>
 */
var original_container = null;
var edit_container = null;
/**
 * Initialize all necessary work when loading complete.
 */
$(window).on("load", function () {
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

function postEditClick(element) {
    // If there is an unfinish edit post, replace that post
    if (edit_container !== null) {
        $(edit_container).replaceWith($(original_container));
    }
    original_container = $(element).parent();
    edit_container = $("#id-div-cpcontainer").clone();
    // replace and add all necessary data
    console.log($(original_container).find(".cl-span-posttype").attr("value"));
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
 * Call when click Edit button.
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
                console.log(response);
                var resp_arr = JSON.parse(response);
                if (resp_arr['flg'] && resp_arr.hasOwnProperty("action")) {// session time out
                    $(location).attr("href", action);
                } else if (resp_arr["flg"] && resp_arr.hasOwnProperty("msg")) { // clear
                    var data = resp_arr["msg"];
                    console.log(data);
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
 * Show error message to user when create or update post.
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

// pcontainer.fadeTo('slow', 0.33);