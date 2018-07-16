app.controller('userCtrl', ['$rootScope', '$scope', 'appServices', '$http', '$state', '$stateParams', '$location','$q','$timeout','$window','$translate', function($rootScope, $scope, appServices, $http, $state, $stateParams, $location,$q,$timeout,$window,DTOptionsBuilder, DTColumnBuilder,$translate) {
    $scope.switchLanguage = function(key) {
      $translate.use(key);
    };

    $scope.events = {};
    $scope.isSelectedUsers = true;
   
    $scope.click = function (open) {
      
        if(open != 'open'){
            
            $scope.open = 'open';
        }else{
            $scope.open = '';
            /*if(open == undefined){
                $scope.click('');
            }*/
        }
    }
    
    $scope.goBack = function(){
        $window.history.back();
    }

    /* For admin session expire auto logout */
    $scope.sessionExpire = function(statusCode) {
        if(parseInt(statusCode) === 405)
        {
            setTimeout(function(){
                let loginSessionKey = $rootScope.loginSessionKey;
                appServices.postAjax(APP.service.adminLogout, { loginSessionKey:loginSessionKey })
                    .then(function(response) {
                        $rootScope.successMessage = response.data.message;
                        localStorage.removeItem('loginSessionKey');
                        localStorage.removeItem('isloggedIn');
                        localStorage.removeItem('userType');
                        $state.go('login');
                })
            },1000);
        }
    }

    $scope.ShowHideAllUsers = function () {
        if($scope.isAllUsers == true){
            $scope.isSelectedUsers = false;
        }else{
            $scope.isSelectedUsers = true;
        }
    }

    /* For send notification */
    $scope.insertSendNotifications = function() {
        let title      = $scope.title;
        let message    = $scope.message;
        let isAllUsers = $scope.isAllUsers;
        let users      = $scope.users;
        let loginSessionKey = $rootScope.loginSessionKey;
          if(!isAllUsers && !users)
          {
            alert('Please select users');
            return false;
          }
          if(isAllUsers == true) users = 'ALL';
           $scope.errorMessage   = false;
           $scope.successMessage = false;
           $scope.isLoading      = true;
          appServices.postAjax(APP.service.insertSendNotifications, { loginSessionKey:loginSessionKey,title:title,message:message,users:users })
            .then(function(response) {
                if(parseInt(response.data.status) === 0){
                    $scope.errorMessage = response.data.message;
                    $scope.isLoading    = false;
                    $scope.sessionExpire(response.data.code);
                }else{
                    $scope.errorMessage   = false;
                    $scope.successMessage = response.data.message;
                    $scope.isLoading = false;
                    $scope.title = '';
                    $scope.message = '';
                    $scope.isAllUsers = false;
                    $scope.users = '';
                    $timeout(function() {
                      $scope.sendNotificationForm.$setPristine();
                      $scope.sendNotificationForm.$setUntouched();
                      $scope.sendNotificationForm.$submitted = false;
                    });
                }
            })
    }

    /* Get Notifications History List */
    $scope.viewNotificationHistory = function() {
        let loginSessionKey = $rootScope.loginSessionKey;
        $scope.errorMessage   = false;
        $scope.successMessage = false;
        $scope.isLoading      = true;
        appServices.postAjax(APP.service.viewNotificationHistory, { loginSessionKey:loginSessionKey})
            .then(function(response) {
                if(parseInt(response.data.status) === 0){
                    $scope.errorMessage = response.data.message;
                    $scope.isLoading    = false;
                    $scope.sessionExpire(response.data.code);
                }else{
                    $scope.errorMessage   = false;
                    $scope.records = response.data.response
                    $scope.isLoading = false;
                    $scope.vm = {};
                    $scope.vm.dtOptions = DTOptionsBuilder.newOptions()
                      .withOption('order', [0, 'asc']);
                }
            })
    }

    /* Manage Content */
    $scope.getContentDetails = function () {
      let contentType = $scope.contentType;
      if(!contentType)
      {
        $scope.htmlcontent  = "";
        return;
      }  
      let loginSessionKey = $rootScope.loginSessionKey;
        appServices.postAjax(APP.service.getContentDetails, { loginSessionKey:loginSessionKey,contentType:contentType })
            .then(function(response) {
                if(parseInt(response.data.status) === 0){
                    $scope.errorMessage = response.data.message;
                    $scope.isLoading      = false;
                    $scope.sessionExpire(response.data.code);
                }else{
                    $scope.errorMessage = false;
                    $scope.htmlcontent  = response.data.response.contentText;
                    $scope.isLoading    = false;
                }
        })
    }

    /* Get Server Details*/
    $scope.getServerDetails = function () {
      let loginSessionKey = $rootScope.loginSessionKey;
        appServices.postAjax(APP.service.getServerDetails, { loginSessionKey:loginSessionKey })
            .then(function(response) {
                if(parseInt(response.data.status) === 0){
                    $scope.errorMessage = response.data.message;
                    $scope.isLoading      = false;
                    $scope.sessionExpire(response.data.code);
                }else{
                    $scope.errorMessage  = false;
                    $scope.isLoading     = false;
                    $scope.wssServerIP   = response.data.response.wssServerIP;
                    $scope.wssServerPort = response.data.response.wssServerPort;
                    $scope.rtmpServerPort= response.data.response.rtmpServerPort;
                    $scope.streamKey     = response.data.response.streamKey;
                    $scope.wssServerURL  = 'wss://'+response.data.response.wssServerIP+':'+response.data.response.wssServerPort;
                    $scope.rtmpServerURL = 'rtmp://'+response.data.response.wssServerIP+':'+response.data.response.rtmpServerPort+'/live';
                }
        })
    }

    /* Update Server Details*/
    $scope.updateServerDetails = function () {
      let loginSessionKey = $rootScope.loginSessionKey;
      let wssServerIP    = $scope.wssServerIP;
      let wssServerPort  = $scope.wssServerPort;
      let rtmpServerPort = $scope.rtmpServerPort;
      let streamKey      = $scope.streamKey;
        appServices.postAjax(APP.service.updateServerDetails, { loginSessionKey:loginSessionKey,wssServerIP:wssServerIP,wssServerPort:wssServerPort,rtmpServerPort:rtmpServerPort,streamKey:streamKey })
            .then(function(response) {
                if(parseInt(response.data.status) === 0){
                    $scope.errorMessage = response.data.message;
                    $scope.isLoading      = false;
                    $scope.sessionExpire(response.data.code);
                }else{
                    $scope.errorMessage  = false;
                    $scope.isLoading     = false;
                    $scope.wssServerURL  = 'wss://'+wssServerIP+':'+wssServerPort;
                    $scope.rtmpServerURL = 'rtmp://'+wssServerIP+':'+rtmpServerPort+'/live';
                    $scope.successMessage = response.data.message;
                }
        })
    }

    $scope.updateContent = function () {
      let contentType = $scope.contentType;
      let contentText = $scope.htmlcontent;
      if(!contentType)
      {
        $scope.htmlcontent  = "";
        $scope.errorMessage = 'Please select content type';
        return;
      }
      if(!contentText)
      {
        $scope.errorMessage = 'Please enter content';
        return;
      }   
      $scope.errorMessage = "";
      let loginSessionKey = $rootScope.loginSessionKey;
        appServices.postAjax(APP.service.updateContent, { loginSessionKey:loginSessionKey,contentType:contentType,contentText:contentText })
            .then(function(response) {
                if(parseInt(response.data.status) === 0){
                    $scope.errorMessage = response.data.message;
                    $scope.isLoading      = false;
                    $scope.sessionExpire(response.data.code);
                }else{
                    $scope.errorMessage   = false;
                    $scope.successMessage = response.data.message;
                    $scope.records      = response.data.response;
                    $scope.isLoading    = false;
                }
        })
    }

    /* To active sidebar menu */
    $scope.activeClass = function (path) {
      return ($location.path().substr(0, path.length) === path) ? 'active' : '';
    }

	/* For admin logout */
	$scope.logout = function() {
        let r = confirm("Are you sure want to log-out? Yes /No");
        if (r == true) {
            let loginSessionKey = $rootScope.loginSessionKey;
            appServices.postAjax(APP.service.adminLogout, { loginSessionKey:loginSessionKey })
                .then(function(response) {
                    if(parseInt(response.data.status) === 0){
                        alert(response.data.message);
                    }else{
                        $rootScope.successMessage = response.data.message;
                        localStorage.removeItem('loginSessionKey');
                        localStorage.removeItem('userFirstName');
                        localStorage.removeItem('userLastName');
                        localStorage.removeItem('isloggedIn');
                        window.location.reload();
                       /*$location.path('/');*/
                    }
            })
        }
	}

    /* For admin change password */
    $scope.updatePassword = function() {
        let oldPassword = $scope.oldPassword;
        let newPassword = $scope.newPassword;
        let confirmPassword = $scope.confirmPassword;
        let loginSessionKey = $rootScope.loginSessionKey;
        $scope.errorMessage   = false;
        $scope.successMessage = false;
        $scope.isLoading      = true;
          appServices.postAjax(APP.service.adminUpdatePassword, { loginSessionKey:loginSessionKey,oldPassword:oldPassword,newPassword:newPassword,confirmPassword:confirmPassword })
            .then(function(response) {
                if(parseInt(response.data.status) === 0){
                    $scope.errorMessage = response.data.message;
                    $scope.isLoading      = false;
                    $scope.sessionExpire(response.data.code);
                }else{
                    $scope.errorMessage   = false;
                    $scope.successMessage = response.data.message;
                    localStorage.setItem('loginSessionKey',response.data.response.newLoginSessionKey);
                    $rootScope.loginSessionKey = response.data.response.newLoginSessionKey;
                    $scope.isLoading = false;
                    $scope.oldPassword = '';
                    $scope.newPassword = '';
                    $scope.confirmPassword = '';
                    $timeout(function() {
                      $scope.passwordForm.$setPristine();
                      $scope.passwordForm.$setUntouched();
                      $scope.passwordForm.$submitted = false;
                    });
                }
            })
    }

    $scope.viewUserDetails = function(userID){
       $location.url('admin/view-user-details/'+userID);
    }


    $scope.getLastUrlSegment = function(){
       return window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
    }

    /* Get user details */
    $scope.initUserDetails = function(){
       let userID = $scope.getLastUrlSegment();
       let loginSessionKey = $rootScope.loginSessionKey;
        $scope.errorMessage   = false;
        $scope.successMessage = false;
        $scope.isLoading      = true;
        appServices.postAjax(APP.service.viewUserDetails, {loginSessionKey:loginSessionKey,userID:userID})
            .then(function(response) {
                console.log('response',response);
                if(parseInt(response.data.status) === 0){
                    $scope.errorMessage = response.data.message;
                    $scope.isLoading    = false;
                    $scope.sessionExpire(response.data.code);
                }else{
                    $scope.errorMessage = false;
                    $scope.records  = response.data.response;
                    $scope.isLoading    = false;
                }
            })
    }

    /* Get users list */
    $scope.getUsersList = function() {
        let loginSessionKey = $rootScope.loginSessionKey;
        $scope.errorMessage   = false;
        $scope.successMessage = false;
        $scope.isLoading      = true;
        appServices.postAjax(APP.service.getUsersList, { loginSessionKey:loginSessionKey})
            .then(function(response) {
                if(parseInt(response.data.status) === 0){
                    $scope.errorMessage = response.data.message;
                    $scope.isLoading      = false;
                    $scope.sessionExpire(response.data.code);
                }else{
                    $scope.errorMessage   = false;
                    $scope.records = response.data.response
                    $scope.isLoading = false;
                    $scope.vm = {};
                    $scope.vm.dtOptions = DTOptionsBuilder.newOptions()
                      .withOption('order', [0, 'asc']);
                }
            })
    }

    /* Export users details */
    $scope.exportUsersDetails = function() {
        let loginSessionKey = $rootScope.loginSessionKey;
        $scope.errorMessage   = false;
        $scope.successMessage = false;
        $scope.isLoading      = true;
        appServices.postAjax(APP.service.exportUsersDetails, { loginSessionKey:loginSessionKey})
            .then(function(response) {
                if(parseInt(response.data.status) === 0){
                    $scope.errorMessage = response.data.message;
                    $scope.isLoading    = false;
                    $scope.sessionExpire(response.data.code);
                }else{
                    $scope.errorMessage   = false;
                    $scope.records = response.data.response;
                    $scope.isLoading = false;
                }
            })
    }


    /* Change user status */
    $scope.changeUserStatus = function(userID,currentStatus) {

        if(currentStatus == '')
            currentStatus = 0;
        let loginSessionKey = $rootScope.loginSessionKey;
        $scope.errorMessage   = false;
        $scope.successMessage = false;
        $scope.isLoading      = true;
        appServices.postAjax(APP.service.changeUserStatus, {loginSessionKey:loginSessionKey,userID:userID,currentStatus:currentStatus})
            .then(function(response) {
                if(parseInt(response.data.status) === 0){
                    $scope.errorMessage = response.data.message;
                    $scope.isLoading    = false;
                    $scope.sessionExpire(response.data.code);
                }else{
                    $scope.errorMessage   = false;
                    $scope.successMessage = response.data.message;
                    $scope.isLoading      = false;
                    $state.go('users', {}, { reload: true });
                }
            })
    }

    /* Delete user */
    $scope.deleteUser = function(userID) {
        let loginSessionKey = $rootScope.loginSessionKey;
        $scope.errorMessage   = false;
        $scope.successMessage = false;
        $scope.isLoading      = true;
        appServices.postAjax(APP.service.deleteUser, {loginSessionKey:loginSessionKey,userID:userID})
            .then(function(response) {
                if(parseInt(response.data.status) === 0){
                    $scope.errorMessage = response.data.message;
                    $scope.isLoading    = false;
                    $scope.sessionExpire(response.data.code);
                }else{
                    $scope.errorMessage   = false;
                    $scope.successMessage = response.data.message;
                    $scope.isLoading      = false;
                    $state.go('users', {}, { reload: true });
                }
            })
    }

    /* Get categories list */
    $scope.getCategoriesList = function() {
        let loginSessionKey = $rootScope.loginSessionKey;
        $scope.errorMessage   = false;
        $scope.successMessage = false;
        $scope.isLoading      = true;
        appServices.postAjax(APP.service.categoriesList, { loginSessionKey:loginSessionKey})
            .then(function(response) {
                console.log(response)
                if(parseInt(response.data.status) === 0){
                    $scope.errorMessage = response.data.message;
                    $scope.isLoading    = false;
                    $scope.sessionExpire(response.data.code);
                }else{
                    $scope.errorMessage   = false;
                    $scope.records = response.data.response
                    $scope.isLoading = false;
                    $scope.vm = {};
                    $scope.vm.dtOptions = DTOptionsBuilder.newOptions()
                      .withOption('order', [0, 'asc']);
                }
            })
    }

    /* For insert category */
    $scope.insertCategory = function() {
        let name = $scope.name;
        let loginSessionKey = $rootScope.loginSessionKey;
        $scope.errorMessage   = false;
        $scope.successMessage = false;
        $scope.isLoading      = true;
          appServices.postAjax(APP.service.insertCategory, { loginSessionKey:loginSessionKey,name:name })
            .then(function(response) {
                if(parseInt(response.data.status) === 0){
                    $scope.errorMessage = response.data.message;
                    $scope.isLoading    = false;
                    $scope.sessionExpire(response.data.code);
                }else{
                    $scope.errorMessage   = false;
                    $scope.successMessage = response.data.message;
                    $scope.isLoading = false;
                    $scope.name = '';
                    $timeout(function() {
                      $scope.questionCategoryForm.$setPristine();
                      $scope.questionCategoryForm.$setUntouched();
                      $scope.questionCategoryForm.$submitted = false;
                    });
                    $state.go('manageCategories');
                }
            })
    }

    /* Delete category */
    $scope.deleteCategory = function(categoryID) {
        let r = confirm("Are you sure, want to delete ?");
        if (r == true) {
            let loginSessionKey = $rootScope.loginSessionKey;
            $scope.errorMessage   = false;
            $scope.successMessage = false;
            $scope.isLoading      = true;
            appServices.postAjax(APP.service.deleteCategory, { loginSessionKey:loginSessionKey,categoryID:categoryID})
                .then(function(response) {
                    if(parseInt(response.data.status) === 0){
                        $scope.errorMessage = response.data.message;
                        $scope.isLoading    = false;
                        $scope.sessionExpire(response.data.code);
                    }else{
                        $scope.errorMessage   = false;
                        $scope.successMessage = response.data.message;
                        $scope.isLoading      = false;
                        $state.go('manageCategories', {}, { reload: true });
                    }
                })
        }
    }

}]);