/**
 * author Nyein Chan Aung<developernca@gmail.com>
 */

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
                console.log(resp_arr);
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
                if (resp_arr['flg'] && resp_arr.hasOwnProperty('action')) {// session time out
                    $(location).attr("href", action);
                } else if (resp_arr['flg'] && resp_arr.hasOwnProperty('msg')) { // clear
                    
                } else if (!resp_arr['flg'] && resp_arr.hasOwnProperty('msg')) { // error occured

                }
            });
}

/**
 * Show error message to user when create or update post.
 * 
 * @param {String} id  id of the p tag to display error 
 * @param {String} msg error message
 * @returns {void}
 */
function showPostError(id, msg) {
    $(id).text(msg).fadeIn();
    setTimeout(function () {
        $(id).fadeOut();
    }, 3500);
}