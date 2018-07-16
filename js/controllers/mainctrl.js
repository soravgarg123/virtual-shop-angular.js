"use strict";

app.controller("mainCtrl", ['$rootScope', '$scope', 'appServices', '$http', '$state', '$stateParams', '$location','$translate', function($rootScope, $scope, appServices, $http, $state, $stateParams, $location,$translate) {

    $rootScope.viewPath = "app/views/";

    $rootScope.imagePath = "app/images/";

    $scope.signIn = function() {
        customAppServices.customDialog("app/views/login.html");
    }; // open Sign in Dialoug

    // for category list
	appServices.postAjax(APP.service.categoriesList, {  type : 0})
        .then(function(response) {
        if(parseInt(response.data.status) === 0){
      
            appServices.message(APP.message_type_error, response.data.message, $rootScope);
        }else{
           /* appServices.message(APP.message_type_success, response.data.message, $rootScope);*/
           $rootScope.categoriesLists = response.data.response.categories;
    		$scope.classCategories = ['btn-success', 'btn-info', 'btn-warning', 'btn-secondary'];
    		$scope.classCategoriesIcons = ['flaticon-cookies', 'flaticon-food', 'flaticon-piece-of-cake', 'flaticon-meal'];
            
        }
    });

    $rootScope.close = function(){
        $rootScope.messageType = '';
    }

}]);


