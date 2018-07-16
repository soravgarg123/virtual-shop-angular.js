"use strict";

/*
 * Purpose : For App configuration
 * Developed By  : Sorav Garg (soravgarg123@gmail.com)
*/

var APP = APP || {};

var hostname = window.location.hostname;
var protocol = window.location.protocol;
var href     = window.location.href;
var origin   = window.location.origin + "/";
APP.message_type_error = 'Error';
APP.message_type_success = 'Success';
APP.timeout_duration = 5000;
APP.base_url = origin;
APP.device_type = 'WEB';

APP.base_image_url = protocol + "//"+hostname+"/uploads/users/";

APP.image_path_url = protocol + "//"+hostname+"/foursquare-new/";

APP.templateUrl = "app/views/";

APP.imagePath = "app/images/";

var domain = origin + "admin/";
var userDomain = origin + "user/";

APP.service = {

    "adminLogin": domain + "login",
    
    "adminLogout": domain + "logout",

    "adminUpdatePassword": domain + "change-password",

    "getContactList": domain + "get-contact-list",

    "getUsersList": domain + "get-users-list",

    "viewUserDetails": domain + "view-user-details",

    "getContentDetails": domain + "get-content-details", 

    "updateContent": domain + "update-content",    

    "deleteUser": domain + "delete-user",

    "exportUsersDetails": domain + "export-users-details",

    "changeUserStatus":domain + "change-user-status",

    "categoriesList": domain + "category-list",

    "insertCategory": domain + "insert-category",

    "deleteCategory": domain + "delete-category",

    "manageGames": domain + "manage-games",

    "saveGame": domain + "save-game",

    "addNewGame": domain + "add-new-game",

    "viewGameDetails": domain + "view-game-details",

    "getTodayGamesList": domain + "get-today-games",

    "getServerDetails": domain + "get-server-details",

    "updateServerDetails": domain + "update-server-details",

    "insertSendNotifications": domain + "insert-send-notifications",

    "viewNotificationHistory": domain + "notifications-history",


    // FRONT END 
    "contentDetails": origin + "content/details",
    "categoriesList": origin + "categories/list",
    "login": userDomain + "login",
    "registration": userDomain + "signup",
    "forgotPassword": userDomain + "forgot-password",
    "resendVerificationCode": userDomain + "resend-verification-code",
    "verifyAccount": userDomain + "verify-account",
    "resetPassword": userDomain + "reset-password",
    "profileDetails": userDomain + "profile-details",
    "updateProfilePic": userDomain + "update-profile-pic",
    "changePassword": userDomain + "change-password",
    "manageSettings": userDomain + "manage-settings",
    "contactUs": userDomain + "contact-us",
    "deleteAccount": userDomain + "delete-account",
    "updateProfile": userDomain + "update-profile",
    "userFollow": userDomain + "connecting",
    "followList": userDomain + "followers/list",
    "userBlock": userDomain + "block",
    "userBlockList": userDomain + "blocklist",
    "myList": origin + "places/my-list",
    "placeAdd": origin + "place/add",
    "placeDelete":origin + "places/delete",
    "placeLike":origin + "places/like",
    "placeSave":origin + "places/saved",
    "placeDetail":origin + "places/detail",
    "addReport":origin + "places/add-report",
    "checkIn":origin + "places/check-in",
    "addComment":origin + "places/add-comment",
    "commentList":origin + "places/comment-list",
    "deleteComment":origin + "places/delete-comment",
    "likeComment":origin + "places/like-comment",
    "otherList":origin + "places/other-list",
    "editPlace":origin + "place/edit",
    "rateUs":origin + "places/rating",
    "addMylist":origin + "places/add-to-mylist",
    "checkedIn":origin+ "places/checkedIn/delete",
    "createMylist":origin+ "places/create-mylist",
    "getMylisting":origin+ "places/getmylist",
    "otherMylist":origin+ "places/mylist",
    "deleteCreatelist":origin+ "places/delete-create-list",
    "placePhoto":origin+ "places/photos"


};
