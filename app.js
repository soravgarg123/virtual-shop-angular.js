"use strict";

/*
 * Purpose : For App configuration
 * Developed By  : Sorav Garg (soravgarg123@gmail.com)
*/

var app = angular.module("LAMMAH", ['ui.router', 'ui.date', 'gm', 'moment-picker','slick','pascalprecht.translate']);
var APP_NAME = 'LAMMAH';

var hostname = window.location.hostname;
var protocol = window.location.protocol;
hostname = protocol + "//"+hostname;
if(hostname == 'http://192.168.1.117' || hostname=='http://localhost'){
    var IMAGE_BASE_PATH = hostname+'/foursquare-new/public/img';
}else{
    var IMAGE_BASE_PATH = hostname+'/public/img';
}

var NO_IMAGE = IMAGE_BASE_PATH+'/noimage';
app.constant('serverPath',{
    no_user_image : NO_IMAGE+"/user.png",
    image_path : hostname+"/",
    no_user_banner : NO_IMAGE+"/banner.png",
    no_user_place : NO_IMAGE+"/place.png"
});
var urlArray = ['','login', 'sign-up', 'forgot-password', 'term-condition', 'privacy-policy', 'help', 'about'];
var urlArray1 = ['','login', 'sign-up', 'forgot-password'];

app.run(function($rootScope, $location, $window, $state) {
    $rootScope.APP_NAME = APP_NAME;
    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams) {
            $rootScope.currenturl = toState.url.split("/")[1];
        })

    $rootScope.$on("$locationChangeStart",function(){
       
    });
    $rootScope.$on('$locationChangeSuccess', function() {
     
       var url = $location.path().split("/");
        if((url[url.length-1] == 'admin')){
            $rootScope.loginContentClass = 'login-content';
        }else{
            $rootScope.loginContentClass = '';
        }

    });

    $rootScope.$watch(function() {

        return ($location.path()).split("/")[1];
    }, function(url) {
      
        $rootScope.loginSessionKey     = localStorage.getItem('loginSessionKey') || "";
        $rootScope.isloggedIn          = localStorage.getItem('isloggedIn') || false;
        $rootScope.userType            = localStorage.getItem('userType') || -1;
        $rootScope.currentPath         = ($location.path()).split("/")[1];
        $rootScope.appView             = false;
        $rootScope.errorMessage        = false;
        $rootScope.successMessage      = false;
        let currentPath = ($location.path()).split("/")[1];
        if (!$rootScope.isloggedIn) { // FALSE
            console.log('dsdsds');
            if(currentPath === 'admin'){
                $location.path('/admin');
            }else{
                var index = urlArray.indexOf(currentPath);
                if(index == -1){
                    $location.path('');
                }
            }
        }else{ // TRUE

            if($rootScope.userType === "1"){
                $location.path('/admin/dashboard');
            }else{
                var index = urlArray1.indexOf(currentPath);
             
                if(index != -1 && $rootScope.userType != -1){
                    $location.path('edit-profile');
                }
            }
        }
    });

}); //run function

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider','$locationProvider','$translateProvider','$qProvider', function($stateProvider, $urlRouterProvider, $httpProvider,$locationProvider,$translateProvider,$qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/");
     var language = (window.navigator.userLanguage || window.navigator.language).toLowerCase();
    console.log(language);
    $translateProvider.registerAvailableLanguageKeys(['en_US','ai_AI' ], {
    'en_US': 'en_US',
    'en_UK': 'en_US',
    'en': 'en_US',
    'ai': 'ai_AI'
    });

    $translateProvider.useStaticFilesLoader({
      prefix: 'lang_',
      suffix: '.json'
    });


    $translateProvider.preferredLanguage('en_US');
    $translateProvider.fallbackLanguage("en_US");
    $stateProvider

        /* Fron End Routing */
        .state('home', {
            url: "/",
            controller: 'homeCtrl',
            templateUrl: "views/front/home.html"
        })
        .state('homeOther', {
            url: "/",
            controller: 'homeCtrl',
            templateUrl: "views/front/home_otherlist.html"
        })
        .state('signUp', {
            url: "/sign-up",
            controller: 'loginController',
            templateUrl: "views/front/signUp.html"
        })
        .state('userLogin', {
            url: "/login",
            controller: 'loginController',
            templateUrl: "views/front/login.html"
        })
        .state('forgotPassword', {
            url: "/forgot-password",
            controller: 'loginController',
            templateUrl: "views/front/forgot_password.html"
        })
        .state('verifyAccount', {
            url: "/verify-account",
            controller: 'loginController',
            templateUrl: "views/front/forgot_password.html"
        })
        .state('about', {
            url: "/about",
            controller: 'loginController',
            templateUrl: "views/front/content.html"
        })
        .state('term', {
            url: "/term-condition",
            controller: 'loginController',
            templateUrl: "views/front/content.html"
        })
        .state('privacy', {
            url: "/privacy-policy",
            controller: 'loginController',
            templateUrl: "views/front/content.html"
        })
        .state('help', {
            url: "/help",
            controller: 'loginController',
            templateUrl: "views/front/help.html"
        })
        .state('myPlaces', {
            url: "/my-places/:userID",
            controller: 'placeController',
            templateUrl: "views/front/my_places.html"
        })
         .state('editPlaces', {
            url: "/edit-places/:placeID/:placeName",
            controller: 'placeController',
            templateUrl: "views/front/edit_places.html"
        })
        .state('editProfile', {
            url: "/edit-profile",
            controller: 'profileController',
            templateUrl: "views/front/edit_profile.html"
        })
        .state('settings', {
            url: "/settings",
            controller: 'profileController',
            templateUrl: "views/front/settings.html"
        })
        .state('myList', {
            url: "/my-List/:placesMyListID/:userID",
            controller: 'placeController',
            templateUrl: "views/front/my_list.html"
        })
        .state('myProfile', {
            url: "/my-profile/:userID",
            controller: 'profileController',
            templateUrl: "views/front/follower.html"
        })
        .state('blockList', {
            url: "/block-user/:userID",
            controller: 'profileController',
            templateUrl: "views/front/block_list.html"
        })
        .state('addPlaces', {
            url: "/add-places",
            controller: 'placeController',
            templateUrl: "views/front/add_places.html"
        })
        .state('likedPlaces', {
            url: "/liked-places/:userID",
            controller: 'placeController',
            templateUrl: "views/front/liked_places.html"
        })
        .state('savedPlaces', {
            url: "/saved-places/:userID",
            controller: 'placeController',
            templateUrl: "views/front/saved_places.html"
        })
        .state('historyPlaces', {
            url: "/history-places/:userID",
            controller: 'placeController',
            templateUrl: "views/front/history.html"
        })
        .state('otherList', {
            url: "/other_list",
            controller: 'placeController',
            templateUrl: "views/front/other_list.html"
        })
        .state('detailPlaces', {
            url: "/places-detail/:placeID/:name",
            controller: 'placeController',
            templateUrl: "views/front/place_detail.html"
        })
      
        /* Admin (Back End) Routing */
        .state('login', {
            url: "/admin",
            controller: 'loginCtrl',
            templateUrl: "views/login.html"
        })
        .state('changePassword', {
            url: "/admin/change-password",
            controller: 'userCtrl',
            templateUrl: "views/change-password.html"
        })
        .state('users', {
            url: "/admin/users",
            controller: 'userCtrl',
            templateUrl: "views/users.html"
        })
        .state('content', {
            url: "/admin/content",
            controller: 'userCtrl',
            templateUrl: "views/content.html"
        })
        .state('viewUserDetails', {
            url: "/admin/view-user-details/:userID",
            controller: 'userCtrl',
            templateUrl: "views/view-user-details.html"
        })
        .state('manageCategories', {
            url: "/admin/manage-categories",
            controller: 'userCtrl',
            templateUrl: "views/manage-categories.html"
        })
        .state('addNewCategory', {
            url: "/admin/add-new-category",
            controller: 'userCtrl',
            templateUrl: "views/add-new-category.html"
        })
        .state('manageServerDetails', {
            url: "/admin/manage-server-details",
            controller: 'userCtrl',
            templateUrl: "views/manage-server-details.html"
        })
        .state('sendNotifications', {
            url: "/admin/send-notifications",
            controller: 'userCtrl',
            templateUrl: "views/send-notifications.html"
        })
        .state('viewNotificationHistory', {
            url: "/admin/notifications-history",
            controller: 'userCtrl',
            templateUrl: "views/notifications-history.html"
        })
        .state('manageGames', {
            url: "/admin/manage-games",
            controller: 'gameCtrl',
            templateUrl: "views/manage-games.html"
        })
        .state('manageGameEvents', {
            url: "/admin/manage-game-events",
            controller: 'gameCtrl',
            templateUrl: "views/manage-game-events.html"
        })
        .state('addNewGame', {
            url: "/admin/add-new-game",
            controller: 'gameCtrl',
            templateUrl: "views/add-new-game.html"
        })
        .state('viewGameDetails', {
            url: "/admin/view-game-details/:userID",
            controller: 'gameCtrl',
            templateUrl: "views/view-game-details.html"
        })
        .state('adminDashboard', {
            url: "/admin/dashboard",
            controller: 'userCtrl',
            templateUrl: "views/dashboard.html"
        });

}]); //config fuction

app.config(['momentPickerProvider', function (momentPickerProvider) {
        momentPickerProvider.options({
            /* Picker properties */
            locale:        'en',
            format:        'L LTS',
            minView:       'decade',
            maxView:       'minute',
            startView:     'year',
            autoclose:     true,
            today:         false,
            keyboard:      false,
            
            /* Extra: Views properties */
            /*leftArrow:     '&larr;',
            rightArrow:    '&rarr;',*/
            leftArrow:     '',
            rightArrow:    '',
            yearsFormat:   'YYYY',
            monthsFormat:  'MMM',
            daysFormat:    'D',
            hoursFormat:   'HH:[00]',
           // minutesFormat: moment.localeData().longDateFormat('LT').replace(/[aA]/, ''),
            secondsFormat: 'ss',
            minutesStep:   5,
            secondsStep:   1
        });
    }]);