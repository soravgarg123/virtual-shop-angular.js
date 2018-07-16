app.controller('loginController', ['$scope', 'appServices', '$http', '$state', '$stateParams', '$location', '$rootScope', '$timeout', '$sce', '$interval','$translate', function($scope, appServices, $http, $state, $stateParams, $location, $rootScope, $timeout, $sce, $interval,$translate) {
    $scope.switchLanguage = function(key) {
      $translate.use(key);
    };
	// for password type
	$scope.type = 'password';
	
	console.log('login Controller');
	$scope.registration = function(){
		$scope.registrationLoader = true;

		appServices.postAjax(APP.service.registration, { userEmailID:$scope.userEmail, userPassword:$scope.userPassword, deviceType : APP.device_type })
            .then(function(response) {
        	if(parseInt(response.data.status) === 0){
        		$scope.registrationLoader = false;
        		appServices.message(APP.message_type_error, response.data.message, $rootScope);
        	}else{
        		appServices.message(APP.message_type_success, response.data.message, $rootScope)
                localStorage.setItem('loginSessionKey',response.data.response.loginSessionKey);
                localStorage.setItem('resendCodeLimit',response.data.response.resendCodeLimit);
                localStorage.setItem('isloggedIn',true);
                localStorage.setItem('userEmail',$scope.userEmail);
                
                $scope.registrationLoader = false;
                $scope.myVar = '1';
              
                $location.path('verify-account');
        	}
        })
	}
	$scope.forgot = function(){
      
		if(localStorage.getItem('userEmail')){
            $scope.userEmail = localStorage.getItem('userEmail');
        }
		if (localStorage.getItem('isloggedIn')) {
			$scope.myVar = '1';
			$scope.resendLoader = true;
            appServices.resendTimer(localStorage.getItem('resendCodeLimit'), $scope);
		}
	}
    $scope.contactData = {};
	$scope.contentDetails = function(type){

		$rootScope.isLoading = true;
		contentType = $location.path().split('/')[$location.path().split('/').length-1];
		$scope.app_name = '';
		if(contentType == 'term-condition'){
			$scope.contentType = 'Term & Condition';
			type = 'TERMS_CONDITIONS';
		}
		if(contentType == 'about'){
			$scope.contentType = 'About Us';
			type = 'ABOUT_US';
			$scope.app_name = $rootScope.APP_NAME;
		}
		if(contentType == 'privacy-policy'){
			$scope.contentType = 'Privacy & Policy';
			type = 'PRIVACY_POLICY';
		}

		if(contentType == 'help'){
			$scope.contentType = 'help & Support';
			type = 'HELP_SUPPORT';
		}
		
		appServices.postAjax(APP.service.contentDetails, { contentType:type })
            .then(function(response) {
        	if(parseInt(response.data.status) === 0){
        		$rootScope.isLoading = false;
        		appServices.message(APP.message_type_error, response.data.message, $rootScope);
            	}else{
                if(type == 'HELP_SUPPORT'){
                    $scope.contentDetail = response.data.response.contentDetail;
                    for (var i = 0; i <  $scope.contentDetail.length; i++) {
                        $scope.contentDetail[i].showStatus = false;
                    }
                }else{
                    $scope.contentDetail = $sce.trustAsHtml(response.data.response.contentDetail.contentText);
                }
        		
        		$rootScope.isLoading = false;

        	}
        })
	}

    $scope.showAccordian = function(index){
        for (var i = 0; i <  $scope.contentDetail.length; i++) {
            if(index == i){
                $scope.contentDetail[i].showStatus = !$scope.contentDetail[i].showStatus;
            }else{
                $scope.contentDetail[i].showStatus = false;
            }
           
        }
    }

    $scope.contact = function(id){
        appServices.modalShow(id);
    }


    $scope.contactSend = function(id){
        $scope.contactLoader = true;
        appServices.postAjax(APP.service.contactUs, $scope.contactData)
            .then(function(response) {
            if(parseInt(response.data.status) === 0){
                $scope.contactLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                $scope.contactLoader = false;
                appServices.modalHide(id);
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
            }
        })
    }

	$scope.myVar = '';
	$scope.data = {};
	/*$scope.myVar = '1';*/
	$scope.forgotPassword = function(){
		$scope.forgotLoader = true;
		
		appServices.postAjax(APP.service.forgotPassword, { userEmailID:$scope.data.userEmail })
            .then(function(response) {
        	if(parseInt(response.data.status) === 0){
        		$scope.forgotLoader = false;
        		appServices.message(APP.message_type_error, response.data.message, $rootScope);
        		
        	}else{
                localStorage.setItem('userEmail',$scope.data.userEmail);
        		$scope.forgot_password = response.data.response;
        		$scope.myVar = '1';
                $scope.forgotLoader = false;
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
              
                $scope.resendLoader = true;
                $scope.timer = response.data.response.resendCodeLimit;
                appServices.resendTimer(response.data.response.resendCodeLimit, $scope, function(){

                });
                
        	}
        })
	}
	
	$scope.verifyOtp = function(){
		$scope.verifyLoader = true;
		if (localStorage.getItem('isloggedIn')) {
			verificationType = 0;
		}else{
			verificationType = 1;
		}
		if(localStorage.getItem('loginSessionKey')){
			loginSessionKey = localStorage.getItem('loginSessionKey');
		}else{
			loginSessionKey = $scope.forgot_password.loginSessionKey;
		}
		appServices.postAjax(APP.service.verifyAccount, { loginSessionKey:loginSessionKey, verificationType : verificationType, tempCode : $scope.data.code1+$scope.data.code2+$scope.data.code3+$scope.data.code4+$scope.data.code5+$scope.data.code6 })
            .then(function(response) {
        	if(parseInt(response.data.status) === 0){
        		$scope.verifyLoader = false;
        		appServices.message(APP.message_type_error, response.data.message, $rootScope)
        	}else{
        		$scope.forgot_password = response.data.response;
        		if(verificationType == 1){
        			$scope.myVar = '2';
        		}else{
                    localStorage.setItem('loginSessionKey',response.data.response.profileResp.loginSessionKey);
                    localStorage.setItem('isloggedIn',true);
        			localStorage.setItem('userType',0);
        			localStorage.setItem('profileResp',JSON.stringify(response.data.response.profileResp));
        			$location.path('my-places');
        		}
                $scope.verifyLoader = false;
                appServices.message(APP.message_type_success, response.data.message, $rootScope)
        	}
        });
	}
	
	$scope.resendCode = function(){
		$scope.resendLoaderResponse = true;
		if(localStorage.getItem('loginSessionKey')){
			loginSessionKey = localStorage.getItem('loginSessionKey');
			resendCodeType = 0;
		}else{
			loginSessionKey = $scope.forgot_password.loginSessionKey;
			resendCodeType = 1;
		}
		appServices.postAjax(APP.service.resendVerificationCode, { loginSessionKey:loginSessionKey, resendCodeType : resendCodeType })
            .then(function(response) {
        	if(parseInt(response.data.status) === 0){
        		$scope.resendLoaderResponse = false;
        		appServices.message(APP.message_type_error, response.data.message, $rootScope);
        	}else{
                $scope.resendLoaderResponse = false;
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
                $scope.resendLoader = true;
                
                appServices.resendTimer(response.data.response.resendCodeLimit, $scope);
        	}
        });
	}

	$scope.resetPassword = function(){
		$scope.resetLoader = true;
		
		appServices.postAjax(APP.service.resetPassword, { loginSessionKey:$scope.forgot_password.loginSessionKey, newPassword : $scope.data.newPassword, confirmPassword : $scope.data.confirmPassword })
            .then(function(response) {
        	if(parseInt(response.data.status) === 0){
        		$scope.resetLoader = false;
        		appServices.message(APP.message_type_error, response.data.message, $rootScope)
        	}else{
        		$location.path('login');
                $scope.resetLoader = false;
                appServices.message(APP.message_type_success, response.data.message, $rootScope)
        	}
        });
	}

	$rootScope.close = function(){

		$rootScope.messageType = '';
	}

	//for user remember password and email
	$scope.loginData = {};
	if(localStorage.getItem('rememberMe')){
		
		$scope.loginData = JSON.parse(localStorage.getItem('rememberMe')); 
		$scope.remember = true;
	}
	$scope.rememberMe = function(){
		
		if($scope.remember){
			
			localStorage.setItem('rememberMe', JSON.stringify($scope.loginData));
			
		}else{
			localStorage.setItem('rememberMe', '')
		}
		console.log('dfgfg'+$scope.remember);
	}

	//for user login
	$scope.login = function (argument) {
		$scope.loginLoader = true;
		
		appServices.postAjax(APP.service.login, { userEmailID:$scope.loginData.userEmail, userPassword : $scope.loginData.userPassword, deviceType : APP.device_type })
            .then(function(response) {
        	if(parseInt(response.data.status) === 0){
        		$scope.loginLoader = false;
        		appServices.message(APP.message_type_error, response.data.message, $rootScope)
        	}else{
        		localStorage.setItem('userEmail',$scope.loginData.userEmail);
                $scope.loginLoader = false;
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
                // user account is not verified
                if(parseInt(response.data.status) === 5){
                	localStorage.setItem('loginSessionKey',response.data.response.profileResp.loginSessionKey);
                	localStorage.setItem('resendCodeLimit',response.data.response.profileResp.resendCodeLimit);
                	localStorage.setItem('isloggedIn',true);
                	$scope.myVar = '1';
                	$location.path('verify-account');
                }else{
                    localStorage.setItem('loginSessionKey',response.data.response.profileResp.loginSessionKey);
                	localStorage.setItem('isloggedIn',true);
                	localStorage.setItem('userType',0);
                	localStorage.setItem('profileResp',JSON.stringify(response.data.response.profileResp));
        			$location.path('my-places');
                }
        	}
        });
	}

}]);

app.controller('profileController', ['$scope', 'appServices', '$rootScope', '$timeout', 'serverPath', '$interpolate','$stateParams','$translate', function($scope, appServices, $rootScope, $timeout, serverPath, $interpolate, $stateParams,$translate){

    
    $scope.imageLoader = true;
    $scope.serverPath = serverPath;
    $scope.type = 'password';
    $scope.currentType = 'password';
    appServices.getUserInfo(function(userInfo){
        $scope.userInfo = userInfo;
    });


        $scope.userFollowLoader = false;
    $scope.userFollow=function(toID){
        $scope.userFollowLoader = true;
        appServices.postAjax(APP.service.userFollow, { loginSessionKey:localStorage.getItem('loginSessionKey'), toID:$stateParams.userID})
            .then(function(response) {
            if(parseInt(response.data.status) === 0){
                $scope.userFollowLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                console.log($scope.userInfo.isFollower);
                if($scope.userInfo.isFollowing == 0){
                    $scope.userInfo.isFollowing = 1;
                }else{
                    $scope.userInfo.isFollowing = 0;
                }
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
                $scope.userFollowLoader = false;
            }
        });
    }

    $scope.follow = function(id){
        appServices.tabShow(id);
    }
    $scope.activeTab = 'home';
    $scope.tabChange = function(id){
        $scope.activeTab = id;
    }

    $scope.pageFollowersNo = 1;
    $scope.pageFollowingNo = 1;
    $scope.loadMore = false;
    $scope.followListLoader = false;
    $scope.followList=function(type){
        let userID = '';
        if($scope.userInfo.userID = $stateParams.userID)
        {
            userID = $stateParams.userID;
        }
        if(type == 'FOLLOWERS'){
            $scope.pageNo = $scope.pageFollowersNo;
        }else{
            $scope.pageNo = $scope.pageFollowingNo;
        }
        if($scope.pageNo == 1){
            $rootScope.isLoading = true;
        }else{
            if(type == 'FOLLOWERS'){
                $scope.followerLoader = true;
            }else{
                $scope.followingLoader = true;
            }
        }
        appServices.postAjax(APP.service.followList, { loginSessionKey:localStorage.getItem('loginSessionKey'), listType:type , pageNo:$scope.pageNo, userID : userID})
            .then(function(response) {
            if(parseInt(response.data.status) === 0){
                $rootScope.isLoading = false;
                if(type == 'FOLLOWERS'){
                    if($scope.pageNo == 1){
                        $scope.followerLists = [];
                    }
                    $scope.loadFollowerMore = false;
                    $scope.followerLoader = false;
                }else{
                    if($scope.pageNo == 1){
                        $scope.followingLists = [];
                    }
                    $scope.loadFollowingMore = false;
                    $scope.followingLoader = false;
                }
                $rootScope.isLoading = false;
                
               /* appServices.message(APP.message_type_error, response.data.message, $rootScope);*/
            }else{
                if(type == 'FOLLOWERS'){
                    if($scope.pageNo == 1){
                        $scope.followerLists = response.data.response.Lists;
                    }else{
                        $scope.followerLists = $scope.followerLists.concat(response.data.response.Lists);
                    }
                    if (response.data.response.totalCount > $scope.pageNo*1) {
                        $scope.loadFollowerMore = true;
                        $scope.pageFollowersNo++;
                    }else{
                        $scope.loadFollowerMore = false;
                    }

                    $scope.followerLoader = false;
                }else{
                    if($scope.pageNo == 1){
                        $scope.followingLists = response.data.response.Lists;
                    }else{
                        $scope.followingLists = $scope.followingLists.concat(response.data.response.Lists);
                    }
                    if (response.data.response.totalCount > $scope.pageNo*1) {
                        $scope.loadFollowingMore = true;
                        $scope.pageFollowingNo++;
                    }else{
                        $scope.loadFollowingMore = false;
                    }
                    $scope.followingLoader = false;
                }
              
            }
        }); 
    }
    $scope.pageNo = 1;
    $rootScope.isLoading = false;
    $scope.userBlockListLoader=false;
    $scope.userBlockList=function(){
         if($scope.pageNo == 1){
            $rootScope.isLoading = true;
        }else{
            $scope.userBlockListLoader = true;
        }
        appServices.postAjax(APP.service.userBlockList, { loginSessionKey:localStorage.getItem('loginSessionKey'), pageNo:$scope.pageNo})
            .then(function(response) {
                console.log(response);
            if(parseInt(response.data.status) === 0){
               
                if($scope.pageNo == 1){
                    $scope.block_list = [];
                }
                $rootScope.isLoading = false;
                $scope.userBlockListLoader = false;
               /* appServices.message(APP.message_type_error, response.data.message, $rootScope);*/
            }else{
                console.log(response.data.response.users);
                 if($scope.pageNo == 1){
                    $scope.block_list = response.data.response.users;
                }else{
                    $scope.block_list = $scope.block_list.concat(response.data.response.users);
                }
                $rootScope.isLoading = false;
                 $scope.userBlockListLoader = false;
                /*appServices.message(APP.message_type_success, response.data.message, $rootScope);*/
               
            }
        }); 
    }
        
    $scope.getMylistLoader = false;
    $scope.getMylisting=function(){
        /*let userID = '';
        if($scope.userInfo.userID = $stateParams.userID)
        {
            userID = $stateParams.userID;
        }*/
        $scope.getMylistLoader = true;
        appServices.postAjax(APP.service.getMylisting, { loginSessionKey:localStorage.getItem('loginSessionKey'), userID : $stateParams.userID})
            .then(function(response) {
                console.log(response);
            if(parseInt(response.data.status) === 0){
                $scope.getMylistLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                $scope.getList=response.data.response;
                /*appServices.message(APP.message_type_success, response.data.message, $rootScope);*/
                $scope.getMylistLoader = false;
            }
        });
    }


    $scope.blockUser=function(id){
        appServices.modalShow(id);
    }


         $scope.userBlockLoader=false;
    $scope.userBlock=function(blockFriendID,index,from){
         $scope.userBlockLoader = true;
         if(from=='ulist')
         {
        appServices.postAjax(APP.service.userBlock, { loginSessionKey:localStorage.getItem('loginSessionKey'), blockFriendID:$stateParams.userID})
            .then(function(response) {

            if(parseInt(response.data.status) === 0){
                $scope.userBlockLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                console.log($scope.userInfo.userBlock);
                
                if($scope.userInfo.userBlock == 0){
                    $scope.userInfo.userBlock = 1;
                }else{
                    $scope.userInfo.userBlock = 0;
                }
                
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
                $scope.userBlockLoader = false;
            }
        });
        }else{
             appServices.postAjax(APP.service.userBlock, { loginSessionKey:localStorage.getItem('loginSessionKey'), blockFriendID:blockFriendID})
            .then(function(response) {
            if(parseInt(response.data.status) === 0){
                $scope.userBlockLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                console.log($scope.userInfo.userBlock);
                $scope.block_list.splice(index, 1);
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
                $scope.userBlockLoader = false;
            }
        });
        }
    }


    $scope.editProfile = function(){
        let userID = '';
        if($scope.userInfo.userID != $stateParams.userID)
        {
            userID = $stateParams.userID;
        }
        $scope.userID = userID;
        if($scope.userID == undefined){
            $scope.userID = '';
        }
        $rootScope.isLoading = true;
        appServices.postAjax(APP.service.profileDetails, { loginSessionKey:localStorage.getItem('loginSessionKey'), userID : $scope.userID })
            .then(function(response) {
            if(parseInt(response.data.status) === 0){
                $rootScope.isLoading = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                if($scope.editprofileform){
                    $scope.editprofileform.$setPristine();
                }
                console.log()
                $scope.profileInfo = response.data.response.profileResp;
                $scope.userInfo = $scope.profileInfo;
                response.data.response.profileResp.userBlock=$scope.userInfo.userBlock;


                if($scope.profileInfo.userGender == 0){
                    $scope.profileInfo.userGender = '';
                }
                if($scope.profileInfo.userDOB){
                    $scope.aDate = $scope.profileInfo.userDOB;
                }
                if(localStorage.getItem('profileResp')){
                    userInfo = JSON.parse(localStorage.getItem('profileResp'));
                    if(userInfo.userID == $scope.profileInfo.userID){
                        localStorage.setItem('profileResp', JSON.stringify(response.data.response.profileResp));
                    }
                }
                $rootScope.isLoading = false;
            }
        });
    }





    $scope.profileUpdate = function(){
        /*console.log($("#userDOB").val())*/
        $scope.profileInfo.userDOB = $("#userDOB").val();
        $scope.updateProfileLoader = true;
        appServices.postAjax(APP.service.updateProfile, { loginSessionKey:localStorage.getItem('loginSessionKey'),userFirstName : $scope.profileInfo.userFirstName, userLastName : $scope.profileInfo.userLastName, userDOB: $scope.profileInfo.userDOB, userDescprition : $scope.profileInfo.userDescprition, userGender : $scope.profileInfo.userGender})
            .then(function(response) {
            if(parseInt(response.data.status) === 0){
                $scope.updateProfileLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                $scope.editprofileform.$setPristine();
                
                localStorage.setItem('profileResp', JSON.stringify($scope.profileInfo));
                $rootScope.userFirstName = $scope.profileInfo.userFirstName;
                $rootScope.userLastName = $scope.profileInfo.userLastName;
                $scope.userInfo = $scope.profileInfo;
                $scope.updateProfileLoader = false;
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
            }
        });
    }

    $scope.onlyRead = function(){
        $("#userDOB").attr('readonly', true);
    }

    $scope.uploadImage = function(){
        $timeout(function() {
            $("#userImage").trigger('click');
        }, 10);  
    }

    $scope.profileImageUpload = function(){
        console.log(document.getElementById('userImage').files[0]);
        $scope.imageLoader = false;
        var fd = new FormData();
        fd.append('loginSessionKey', localStorage.getItem('loginSessionKey'));
        fd.append('userImage', document.getElementById('userImage').files[0]);
        console.log(fd);
        appServices.fileUpload(APP.service.updateProfilePic, fd)
            .then(function(response) {
            if(parseInt(response.data.status) === 0){
                $scope.imageLoader = true;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                $scope.imageLoader = true;
                $scope.profileInfo.imagePath = response.data.response.profileResp.imagePath;
                $scope.profileInfo.thumbImagePath = response.data.response.profileResp.thumbImagePath;
                localStorage.setItem('profileResp', JSON.stringify($scope.profileInfo));
                console.log(response)
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
            }
        });
    }

    $scope.changePassword = function(){
        $scope.changeLoader = true;
        appServices.postAjax(APP.service.changePassword, { loginSessionKey:localStorage.getItem('loginSessionKey'),oldPassword : $scope.currentPassword, newPassword : $scope.newPassword, confirmPassword : $scope.newPassword})
            .then(function(response) {
            if(parseInt(response.data.status) === 0){
                $scope.changeLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                $scope.currentPassword = '';
                $scope.newPassword = '';
                $scope.changePasswordForm.$setPristine();
                $scope.changeLoader = false;
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
                $timeout(function() {
                    $rootScope.logout(true);
                }, 100);
            }
        });
    }


    $scope.updateSetting = function(fieldName, fieldValue,key){
        if(fieldValue == true){
            fieldValue = 1;
            $translate.use(key);
        }

        if(fieldValue == false){
            fieldValue = 0;
            $translate.use(key);
            
        }
        console.log(fieldValue)
       
        appServices.postAjax(APP.service.manageSettings, { loginSessionKey:localStorage.getItem('loginSessionKey'),fieldName : fieldName, fieldValue : fieldValue})
            .then(function(response) {
                console.log(response)
            if(parseInt(response.data.status) === 0){
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                this.trans=$translate.use(key);
                console.log($translate.use(key));
                /*appServices.message(APP.message_type_success, response.data.message, $rootScope);*/
            }
        });
    }

    $scope.deleteAccoutPopup = function(id){
        appServices.modalShow(id);
    }

    $scope.deleteAcountReason = "It doesn't seem useful";
    $scope.deleteAccout = function(){

        $scope.deleteAccountLoader = true;
        appServices.postAjax(APP.service.deleteAccount, { loginSessionKey:localStorage.getItem('loginSessionKey'), deleteAcountReason : $scope.deleteAcountReason})
            .then(function(response) {
            if(parseInt(response.data.status) === 0){
                $scope.deleteAccountLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
                $scope.deleteAccountLoader = false;
                $timeout(function() {
                    $rootScope.logout(true);
                }, 100);
                
            }
        });
    }

    var dateToday = new Date(); 
    $scope.aDate = '';

    $scope.dateOptions = {
        changeMonth: true, 
        changeYear: true, 
        dateFormat: 'yy-mm-dd',
        yearRange: "-150:+0",
        maxDate: dateToday
    }
    
    $rootScope.close = function(){
        $rootScope.messageType = '';
    }
}]);

app.controller('headerController', ['$scope', '$rootScope', 'appServices', '$location','$translate', function($scope, $rootScope, appServices, $location,$translate){
    $scope.switchLanguage = function(key) {
      $translate.use(key);
    };
	$rootScope.logout = function(profile) {

        if(profile != true){
            var r = confirm("Are you sure want to log-out? Yes /No");
        }else{
            var r = true;
        }
      
        if (r == true) {
            localStorage.removeItem('loginSessionKey');
            localStorage.removeItem('resendCodeLimit');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('profileResp');
            localStorage.removeItem('userType');
            localStorage.removeItem('isloggedIn');
            $location.path('/');
            window.location.reload();
        }
	}
    appServices.getUserInfo(function(response){

        $scope.userInfo = response;
        $rootScope.userFirstName = $scope.userInfo.userFirstName;
        $rootScope.userLastName = $scope.userInfo.userLastName;
    });
    navigator.geolocation.getCurrentPosition(success, error);
        function success(position,index) {
            console.log(position.coords.latitude)
            console.log(position.coords.longitude)
            var GEOCODING = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + '%2C' + position.coords.longitude + '&language=en';
            $.getJSON(GEOCODING).done(function(response) {
                 if(parseInt(response.status) === 'OK'){
                console.log(response)
                console.log('failed');
            }else
            {
                 $scope.cityLocation=response.results[0].address_components[3].short_name;
                console.log($scope.cityLocation);
                console.log('success');
            }       
            })
        }
        function error(err) {
            console.log(err)
        }


    $rootScope.clickCategory=function(categoryID,index){
        console.log($rootScope.categoriesLists[index].categoryID);
        $scope.categoryID=$rootScope.categoriesLists[index].categoryID;
    };
     
    $rootScope.clickSearch=function(searchPlace){
        $scope.searchTerm=searchPlace;
        $scope.searchPlace=null;

    };

}]);

app.controller('placeController', ['$scope', '$compile', 'appServices', '$rootScope', '$interpolate', 'serverPath', '$location', '$stateParams', '$timeout','$sce','$translate', function($scope, $compile, appServices, $rootScope, $interpolate, serverPath, $location, $stateParams, $timeout,$sce,$translate){
    $scope.switchLanguage = function(key) {
      $translate.use(key);
    };
    $scope.img_path = APP.image_path_url;
    appServices.getUserInfo(function(userInfo){
        $scope.userInfo = userInfo;
    });
    $scope.serverPath = serverPath;
    $scope.placeFormData = {
        isOpenForAllDays : 1,
        locations: [],
        latitudes :[],
        longitudes : []
    };
     $scope.editPlaceForm = {
        isOpenForAllDays : 1,
        locations: [],
        latitudes :[],
        longitudes : []
    };
       
      
  

    $scope.addMoreLocation = false;
    $scope.count = 1;
   /* $scope.addEdLocation = function(){
        $scope.addMoreLocation = false;
        $scope.count++;
        var html='<span id="remove_{{::count}}"></br><input type="text" class="form-control" placeholder="Location" ng-model="autocomplete_'+$scope.count+'" ng-keyup="getElementId1($event)" gm-place-autocomplete name="locations" required id="locations_{{::count}}" ><div ng-click="closeLocation(count)" id="close_{{::count}}">X</div></span>',
        el = document.getElementById('moreLocations');
        angular.element(el).append( $compile(html)($scope) );
       
        $("#close_"+(parseInt($scope.count)-1)).hide();
    }*/

    $scope.addEdLocation = function(){
        $scope.addMoreLocation = false;
        $scope.count++;
        var html='<span id="remove_{{::count}}"></br><input type="text" class="form-control" placeholder="Location" ng-model="autocomplete_'+$scope.count+'" ng-keyup="getElementId1($event)" gm-places-autocomplete name="locations" required id="locations_{{::count}}" ><div ng-click="closeLocation(count)" id="close_{{::count}}">X</div></span>',
        el = document.getElementById('moreLocations');
        angular.element(el).append( $compile(html)($scope) );
       
       /* $("#close_"+(parseInt($scope.count)-1)).hide();*/
    }

   /* $scope.getElementId1 = function(event){
        console.log(event.target.ngModel)
        $scope.elementId = event.target.id;
        var address = $("#"+$scope.elementId).val();
        if(address.length > 3){
            $scope.addMoreLocation = true;
        }
        index = $scope.editPlaceForm.locations.indexOf(address);
        
        if(index == -1){
            arrayIndex = $scope.elementId.split('locations_');
            arrayIndex = arrayIndex[arrayIndex.length-1];
            arrayIndex = arrayIndex-1;
            $scope.editPlaceForm.locations[arrayIndex] = address;
            $scope.editPlaceForm.latitudes[arrayIndex] = '';
            $scope.editPlaceForm.longitudes[arrayIndex] = '';
             console.log($scope.editPlaceForm)
        }
    }
*/
    $scope.getElementId1 = function(event){
        console.log(event.target.ngModel)
        $scope.elementId = event.target.id;
        var address = $("#"+$scope.elementId).val();
        if(address.length > 3){
            $scope.addMoreLocation = true;
        }
        index = $scope.editPlaceForm.locations.indexOf(address);
        
        if(index == -1){
            arrayIndex = $scope.elementId.split('locations_');
            arrayIndex = arrayIndex[arrayIndex.length-1];
            arrayIndex = arrayIndex-1;
            $scope.editPlaceForm.locations[arrayIndex] = address;
            $scope.editPlaceForm.latitudes[arrayIndex] = '';
            $scope.editPlaceForm.longitudes[arrayIndex] = '';
             console.log($scope.editPlaceForm)
        }
    }

    /*$scope.closeLocation = function(count){
        $scope.addMoreLocation = true;
        $("#remove_"+count).remove();
     
        if(count != 1){
            $("#close_"+(parseInt(count)-1)).show();
        }
        console.log(count)
        count = parseInt(count)-1;
        $scope.editPlaceForm.locations.splice(count, 1);
        $scope.editPlaceForm.latitudes.splice(count, 1);
        $scope.editPlaceForm.longitudes.splice(count, 1);
        console.log($scope.editPlaceForm.locations)

        $scope.count--;
    }*/

    $scope.closeLocation = function(count){
        $scope.addMoreLocation = true;
        $("#remove_"+count).remove();
     
        if(count != 1){
            $("#close_"+(parseInt(count)-1)).show();
        }
        console.log(count)
        count = parseInt(count)-1;
        $scope.editPlaceForm.locations.splice(count, 1);
        $scope.editPlaceForm.latitudes.splice(count, 1);
        $scope.editPlaceForm.longitudes.splice(count, 1);
        console.log($scope.editPlaceForm.locations)

        $scope.count--;
    }

$scope.coverEditPhoto = function(id){
        appServices.showImage(id);  
    }


    $scope.lat = undefined;
    $scope.lng = undefined;

    /*$scope.$on('gmPlaceAutocomplete::placeChanged', function(){
        $scope.addMoreLocation = true;
        
        var address = $("#"+$scope.elementId).val();
        index = $scope.editPlaceForm.locations.indexOf(address);
        
        if(index == -1){
            arrayIndex = $scope.elementId.split('locations_');
            arrayIndex = arrayIndex[arrayIndex.length-1];
            arrayIndex = arrayIndex-1;
           
            if(arrayIndex == 0){
                var location = $scope.autocomplete_1.getPlace().geometry.location;
            }
            if(arrayIndex == 1){
                var location = $scope.autocomplete_2.getPlace().geometry.location;
            }
            if(arrayIndex == 2){
                var location = $scope.autocomplete_3.getPlace().geometry.location;
            }
            if(arrayIndex == 3){
                var location = $scope.autocomplete_4.getPlace().geometry.location;
            }
            if(arrayIndex == 4){
                var location = $scope.autocomplete_5.getPlace().geometry.location;
            }
             
            $scope.editPlaceForm.locations[arrayIndex] = address;
            $scope.editPlaceForm.latitudes[arrayIndex] = location.lat();
            $scope.editPlaceForm.longitudes[arrayIndex] = location.lng();
        }else{
            $scope.addMoreLocation = false;
            $("#"+$scope.elementId).val('');
        }
       
        console.log($scope.editPlaceForm)
        $scope.$apply();
    });*/

    $scope.$on('gmPlaceAutocomplete::placeChanged', function(){
        $scope.addMoreLocation = true;
        
        var address = $("#"+$scope.elementId).val();
        index = $scope.editPlaceForm.locations.indexOf(address);
        
        if(index == -1){
            arrayIndex = $scope.elementId.split('locations_');
            arrayIndex = arrayIndex[arrayIndex.length-1];
            arrayIndex = arrayIndex-1;
           
            if(arrayIndex == 0){
                var location = $scope.autocomplete_1.getPlace().geometry.location;
            }
            if(arrayIndex == 1){
                var location = $scope.autocomplete_2.getPlace().geometry.location;
            }
            if(arrayIndex == 2){
                var location = $scope.autocomplete_3.getPlace().geometry.location;
            }
            if(arrayIndex == 3){
                var location = $scope.autocomplete_4.getPlace().geometry.location;
            }
            if(arrayIndex == 4){
                var location = $scope.autocomplete_5.getPlace().geometry.location;
            }
             
            $scope.editPlaceForm.locations[arrayIndex] = address;
            $scope.editPlaceForm.latitudes[arrayIndex] = location.lat();
            $scope.editPlaceForm.longitudes[arrayIndex] = location.lng();
        }else{
            $scope.addMoreLocation = false;
            $("#"+$scope.elementId).val('');
        }
       
        console.log($scope.editPlaceForm)
        $scope.$apply();
    });

    /*this is use for edit place*/

   /* $scope.serviceType=[];
    $scope.orderType=[];
    $scope.price=[];
    $scope.isOpenForAllDays=[];
    $scope.isMondayOn=[];
    $scope.isTuesdayOn=[];
    $scope.isWenesdayOn=[];
    $scope.isThursdayOn=[];
    $scope.isFridayOn=[];
    $scope.isSaturdayOn=[];
    $scope.isSundayOn=[];
    $scope.mondayStartTime=[];
    $scope.mondayEndTime=[];
    $scope.tuesdayStartTime=[];
    $scope.tuesdayEndTime=[];
    $scope.wenesdayStartTime=[];
    $scope.wenesdayEndTime=[];
    $scope.thursdayStartTime=[];
    $scope.thursdayEndTime=[];
    $scope.fridayStartTime=[];
    $scope.fridayEndTime=[];
    $scope.saturdayStartTime=[];
    $scope.saturdayEndTime=[];
    $scope.sundayStartTime=[];
    $scope.sundayEndTime=[];
    $scope.descprition=[];
    $scope.locations=[];
    $scope.categoryID=[];*/
   /* $scope.photos=[];*/

    /*$scope.editPlace=function(){

        $rootScope.isLoading = true;
        appServices.postAjax(APP.service.placeDetail, { loginSessionKey:localStorage.getItem('loginSessionKey'), placeID:$stateParams.placeID})
            .then(function(response) {
                console.log(response);
            if(parseInt(response.data.status) === 0){
                $rootScope.isLoading = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                  $scope.editPlaceForm=response.data.response.detail;
                $rootScope.isLoading = false;
                 localStorage.setItem('detail', JSON.stringify(response.data.response.detail));
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
            }
        });
    }*/
    $scope.editPlace=function(){

        $rootScope.isLoading = true;
        appServices.postAjax(APP.service.placeDetail, { loginSessionKey:localStorage.getItem('loginSessionKey'), placeID:$stateParams.placeID})
            .then(function(response) {
                console.log(response);
            if(parseInt(response.data.status) === 0){
                $rootScope.isLoading = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                $scope.editPlaceForm=response.data.response.detail;
                addTags = [];
                if($scope.editPlaceForm.placesTags){
                    for (var i = 0; i < $scope.editPlaceForm.placesTags.length; i++) {
                        addTags.push($scope.editPlaceForm.placesTags[i].tagName);
                    }
                }
                latitudes = [];
                longitudes = [];
                locations = [];
                for (var i = 0; i < $scope.editPlaceForm.placesLocation.length; i++) {
                    latitudes.push($scope.editPlaceForm.placesLocation[i].latitude);
                    longitudes.push($scope.editPlaceForm.placesLocation[i].longitude);
                    locations.push($scope.editPlaceForm.placesLocation[i].location);
                    if(i==0){
                        $scope.autocomplete_1 = $scope.editPlaceForm.placesLocation[i].location;
                    }
                    if(i==1){
                        $scope.autocomplete_2 = $scope.editPlaceForm.placesLocation[i].location;
                    }
                    if(i==2){
                        $scope.autocomplete_3 = $scope.editPlaceForm.placesLocation[i].location;
                    }
                    if(i==3){
                        $scope.autocomplete_4 = $scope.editPlaceForm.placesLocation[i].location;
                    }
                    if(i==4){
                        $scope.autocomplete_5 = $scope.editPlaceForm.placesLocation[i].location;
                    }
                }

                if($scope.editPlaceForm.isOpenForAllDays == 1){
                    $scope.editPlaceForm.starttimepicker = $scope.editPlaceForm.mondayStartTime;
                    $scope.editPlaceForm.endtimepicker = $scope.editPlaceForm.mondayEndTime;
                }
                
                $scope.count = 5;
                $scope.editPlaceForm.latitudes = latitudes;
                $scope.editPlaceForm.longitudes = longitudes;
                $scope.editPlaceForm.locations = locations;
                $scope.editPlaceForm.addTags = addTags.join(',');
                $rootScope.isLoading = false;
                for (var i = $scope.editPlaceForm.placesLocation.length+1; i < 6; i++) {
                    $scope.closeLocation(i, 'edit');
                }
            }
        });
    }

/*    $scope.details = {};
    $scope.editPlacesTest = function(){
        $scope.editPlaceLoader = true;
        console.log($scope.editPlaceForm.latitudes.length);
        for (var i = 0; i < $scope.editPlaceForm.latitudes.length; i++) {
            (function(i){
                console.log($scope.editPlaceForm.latitudes[i])
                if(!$scope.editPlaceForm.latitudes[i]){
                    address = $scope.editPlaceForm.locations[i];
                    if(address){
                        // Initialize the Geocoder
                        geocoder = new google.maps.Geocoder();
                        if (geocoder) {
                            geocoder.geocode({
                                'address': address
                            }, function (results, status) {
                                if (status == google.maps.GeocoderStatus.OK) {
                                    $scope.editPlaceForm.latitudes[i] = results[0].geometry.location.lat();
                                    $scope.editPlaceForm.longitudes[i] = results[0].geometry.location.lng();
                                    console.log(results[0].geometry.location.lng())
                                    if($scope.editPlaceForm.latitudes.length-1 == i){
                                        $scope.placeUpdate($stateParams.placeDetail);
                                    }
                                }
                            });
                        }
                    }
                      
                }else{
                    if($scope.editPlaceForm.latitudes.length-1 == i){
                        $scope.placeUpdate($stateParams.placeID);
                    }
                    
                }
            })(i);   
        }
    }*/

    $scope.changePhotos = [];
    $scope.details = {};
    $scope.editPlacesTest = function(){
        
        $scope.editPlaceLoader = true;
        console.log(JSON.stringify($scope.Data));
        for (var i = 0; i < $scope.editPlaceForm.latitudes.length; i++) {
            (function(i){
                console.log($scope.editPlaceForm.latitudes[i])
                if(!$scope.editPlaceForm.latitudes[i]){
                    address = $scope.editPlaceForm.locations[i];
                    if(address){
                        // Initialize the Geocoder
                        geocoder = new google.maps.Geocoder();
                        if (geocoder) {
                            geocoder.geocode({
                                'address': address
                            }, function (results, status) {
                                if (status == google.maps.GeocoderStatus.OK) {
                                    $scope.editPlaceForm.latitudes[i] = results[0].geometry.location.lat();
                                    $scope.editPlaceForm.longitudes[i] = results[0].geometry.location.lng();
                                    console.log(results[0].geometry.location.lng())
                                    if($scope.editPlaceForm.latitudes.length-1 == i){
                                        $scope.placeUpdate($stateParams.placeDetail);
                                    }
                                }
                            });
                        }
                    }
                      
                }else{
                    if($scope.editPlaceForm.latitudes.length-1 == i){
                        $scope.placeUpdate($stateParams.placeID);
                    }
                    
                }
            })(i);   
        }
    }

    
        $scope.updatePlaceLoader = false;
            $scope.placeUpdate = function(placeID){
        $scope.updatePlaceLoader = true;
        $scope.details = $scope.editPlaceForm;
        var fd = new FormData();
        addTags = []
        if($scope.editPlaceForm.addTags){
            if($scope.editPlaceForm.addTags.search(',') != -1)
            {        
                addTags = $scope.editPlaceForm.addTags;
                addTags = addTags.split(',');
            }else{  
                addTags.push($scope.editPlaceForm.addTags);
            }
           
        }

        var coverPhoto = $scope.Data.coverPhoto;
        var photos = [];
        var fd = new FormData();
        if($scope.Data.coverPhoto1){
            fd.append('photos', $scope.Data.coverPhoto1);
        }
        if($scope.Data.coverPhoto2){
            fd.append('photos', $scope.Data.coverPhoto2);
        }
        if($scope.Data.coverPhoto3){
            fd.append('photos', $scope.Data.coverPhoto3);
        }
        if($scope.Data.coverPhoto4){
            fd.append('photos', $scope.Data.coverPhoto4);
        }
        if($scope.Data.coverPhoto5){
            fd.append('photos', $scope.Data.coverPhoto5);
        }
        fd.append('loginSessionKey', localStorage.getItem('loginSessionKey'));
        fd.append('placeID', $stateParams.placeID);
         
        fd.append('name', $scope.details.name);
        fd.append('email', $scope.details.email);
        fd.append('serviceType', $scope.details.serviceType);
        fd.append('orderType', $scope.details.orderType);
        fd.append('price', $scope.details.price);
        if($scope.details.descprition){
          fd.append('descprition', $scope.details.descprition);
        }
        if(addTags.length > 0){
            fd.append('tags', JSON.stringify(addTags));
        }
        if($scope.details.phoneNo){
            fd.append('phoneNo', $scope.details.phoneNo);
        }
        if($scope.details.whatsAppNo){
            fd.append('whatsAppNo', $scope.details.whatsAppNo);
        }
        fd.append('categoryID', $scope.details.categoryID);
        fd.append('locations', JSON.stringify($scope.details.locations));
        fd.append('latitudes', JSON.stringify($scope.details.latitudes));
        fd.append('longitudes', JSON.stringify($scope.details.longitudes));
        fd.append('isOpenForAllDays', $scope.details.isOpenForAllDays);
        if($scope.details.isOpenForAllDays == 1){
            $scope.details.isMondayOn = 1;
            $scope.details.mondayStartTime = $scope.details.starttimepicker;
            $scope.details.mondayEndTime = $scope.details.endtimepicker;
            $scope.details.isTuesdayOn = 1;
            $scope.details.tuesdayStartTime = $scope.details.starttimepicker;
            $scope.details.tuesdayEndTime = $scope.details.endtimepicker;
            $scope.details.isWenesdayOn = 1;
            $scope.details.wenesdayStartTime = $scope.details.starttimepicker;
            $scope.details.wenesdayEndTime = $scope.details.endtimepicker;
            $scope.details.isThursdayOn = 1;
            $scope.details.thursdayStartTime = $scope.details.starttimepicker;
            $scope.details.thursdayEndTime = $scope.details.endtimepicker;
            $scope.details.isFridayOn = 1;
            $scope.details.fridayStartTime = $scope.details.starttimepicker;
            $scope.details.fridayEndTime = $scope.details.endtimepicker;
            $scope.details.isSaturdayOn = 1;
            $scope.details.saturdayStartTime = $scope.details.starttimepicker;
            $scope.details.saturdayEndTime = $scope.details.endtimepicker;
            $scope.details.isSundayOn = 1;
            $scope.details.sundayStartTime = $scope.details.starttimepicker;
            $scope.details.sundayEndTime = $scope.details.endtimepicker;
        }
        fd.append('isMondayOn', $scope.details.isMondayOn);
        fd.append('mondayStartTime', $scope.details.mondayStartTime);
        fd.append('mondayEndTime', $scope.details.mondayEndTime);
        fd.append('isTuesdayOn', $scope.details.isTuesdayOn);
        fd.append('tuesdayStartTime', $scope.details.tuesdayStartTime);
        fd.append('tuesdayEndTime', $scope.details.tuesdayEndTime);
        fd.append('isWenesdayOn', $scope.details.isWenesdayOn);
        fd.append('wenesdayStartTime', $scope.details.wenesdayStartTime);
        fd.append('wenesdayEndTime', $scope.details.wenesdayEndTime);
        fd.append('isThursdayOn', $scope.details.isThursdayOn);
        fd.append('thursdayStartTime', $scope.details.thursdayStartTime);
        fd.append('thursdayEndTime', $scope.details.thursdayEndTime);
        fd.append('isFridayOn', $scope.details.isFridayOn);
        fd.append('fridayStartTime', $scope.details.fridayStartTime);
        fd.append('fridayEndTime', $scope.details.fridayEndTime);
        fd.append('isSaturdayOn', $scope.details.isSaturdayOn);
        fd.append('saturdayStartTime', $scope.details.saturdayStartTime);
        fd.append('saturdayEndTime', $scope.details.saturdayEndTime);
        fd.append('isSundayOn', $scope.details.isSundayOn);
        fd.append('sundayStartTime', $scope.details.sundayStartTime);
        fd.append('sundayEndTime', $scope.details.sundayEndTime);
        fd.append('coverPhoto', coverPhoto);
        fd.append('changePhotos', JSON.stringify($scope.changePhotos));
        appServices.fileUpload(APP.service.editPlace,fd)
            .then(function(response) {
            if(parseInt(response.data.status) === 0){
                $scope.updatePlaceLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                $scope.updatePlaceLoader = false;
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
            }
        });
    }

    $scope.listone = "";
    $scope.listtwo = "one,two,three";
    $scope.listthree = "";
    $scope.addTime = true;
     $scope.$watch('editPlaceForm', function(){

        if ($scope.editPlaceForm.starttimepicker && $scope.editPlaceForm.endtimepicker) {
            if($scope.editPlaceForm.isOpenForAllDays == 1){
                if ($scope.editPlaceForm.starttimepicker < $scope.editPlaceForm.endtimepicker) {
                    $("#starttimepicker").hide();
                    $scope.addTime = false;
                }else{
                    $("#starttimepicker").show(); 
                    $scope.addTime = true;
                }
            }else{
/*                $scope.editPlaceForm.starttimepicker = '';
                $scope.editPlaceForm.endtimepicker = '';*/
                $scope.addTime = false;
            }
        }

        if($scope.editPlaceForm.mondayStartTime && $scope.editPlaceForm.mondayEndTime){
            if($scope.editPlaceForm.isMondayOn == 1){
                if ($scope.editPlaceForm.mondayStartTime < $scope.editPlaceForm.mondayEndTime) {
                    $("#isMondayOn").hide();
                    $scope.addTime = false;
                }else{
                    $("#isMondayOn").show(); 
                    $scope.addTime = true;
                }
            }else{
                $scope.editPlaceForm.mondayStartTime = '';
                $scope.editPlaceForm.mondayEndTime = '';
                $scope.addTime = false;
            }
            
        }

        if($scope.editPlaceForm.tuesdayStartTime && $scope.editPlaceForm.tuesdayEndTime){
            if($scope.editPlaceForm.isTuesdayOn == 1){
                if ($scope.editPlaceForm.tuesdayStartTime < $scope.editPlaceForm.tuesdayEndTime) {
                    $("#isTuesdayOn").hide();
                    $scope.addTime = false;
                }else{
                    $("#isTuesdayOn").show();
                    $scope.addTime = true; 
                }
            }else{
                $scope.editPlaceForm.tuesdayStartTime = '';
                $scope.editPlaceForm.tuesdayEndTime = '';
                $scope.addTime = false;
            }
        }

        if($scope.editPlaceForm.wenesdayStartTime && $scope.editPlaceForm.wenesdayEndTime){
            if($scope.editPlaceForm.isWenesdayOn == 1){
                if ($scope.editPlaceForm.wenesdayStartTime < $scope.editPlaceForm.wenesdayEndTime) {
                    $("#isWenesdayOn").hide();
                    $scope.addTime = false;
                }else{
                    $("#isWenesdayOn").show(); 
                    $scope.addTime = true;
                }
            }else{
                $scope.editPlaceForm.wenesdayStartTime = '';
                $scope.editPlaceForm.wenesdayEndTime = '';
                $scope.addTime = false;
            }
        }

        if($scope.editPlaceForm.thursdayStartTime && $scope.editPlaceForm.thursdayEndTime){
            if($scope.editPlaceForm.isThursdayOn == 1){
                if ($scope.editPlaceForm.thursdayStartTime < $scope.editPlaceForm.thursdayEndTime) {
                    $("#isThursdayOn").hide();
                    $scope.addTime = false;
                }else{
                    $("#isThursdayOn").show();
                    $scope.addTime = true; 
                }
            }else{
                $scope.editPlaceForm.thursdayStartTime = '';
                $scope.editPlaceForm.thursdayEndTime = '';
                $scope.addTime = false;
            }
        }

        if($scope.editPlaceForm.fridayStartTime && $scope.editPlaceForm.fridayEndTime){
            if($scope.editPlaceForm.isFridayOn == 1){
                if ($scope.editPlaceForm.fridayStartTime < $scope.editPlaceForm.fridayEndTime) {
                    $("#isFridayOn").hide();
                    $scope.addTime = false;
                }else{
                    $("#isFridayOn").show(); 
                    $scope.addTime = true;
                }
            }else{
                $scope.editPlaceForm.fridayStartTime = '';
                $scope.editPlaceForm.fridayEndTime = '';
                $scope.addTime = false;
            }
        }

        if($scope.editPlaceForm.saturdayStartTime && $scope.editPlaceForm.saturdayEndTime){
            if($scope.editPlaceForm.isSaturdayOn == 1){
                if ($scope.editPlaceForm.saturdayStartTime < $scope.editPlaceForm.saturdayEndTime) {
                    $("#isSaturdayOn").hide();
                    $scope.addTime = false;
                }else{
                    $("#isSaturdayOn").show(); 
                    $scope.addTime = true;
                }
            }else{
                $scope.editPlaceForm.saturdayStartTime = '';
                $scope.editPlaceForm.saturdayEndTime = '';
                $scope.addTime = false;
            }
        }

        if($scope.editPlaceForm.sundayStartTime && $scope.editPlaceForm.sundayEndTime){
            if($scope.editPlaceForm.isSundayOn == 1){
                if ($scope.editPlaceForm.sundayStartTime < $scope.editPlaceForm.sundayEndTime) {
                    $("#isSundayOn").hide();
                    $scope.addTime = false;
                }else{
                    $("#isSundayOn").show(); 
                    $scope.addTime = true;
                }
            }else{
                $scope.editPlaceForm.sundayStartTime = '';
                $scope.editPlaceForm.sundayEndTime = '';
                $scope.addTime = false;
            }
        }
    },true);


    
    $scope.addMoreLocation = false;
    $scope.count = 1;
    /*$scope.addLocation = function(){
        $scope.addMoreLocation = false;
        $scope.count++;
        var html='<span id="remove_{{::count}}"></br><input type="text" class="form-control" placeholder="Location" ng-model="autocomplete_'+$scope.count+'" ng-keyup="getElementId($event)" gm-places-autocomplete name="locations" required id="locations_{{::count}}" ><div ng-click="closeLocation(count)" id="close_{{::count}}">X</div></span>',
        el = document.getElementById('moreLocations');
        angular.element(el).append( $compile(html)($scope) );
       
        $("#close_"+(parseInt($scope.count)-1)).hide();
    }*/

    $scope.addLocation = function(){
        $scope.addMoreLocation = false;
        $scope.count++;
        var html='<span id="remove_{{::count}}"></br><input type="text" class="form-control" placeholder="Location" ng-model="autocomplete_'+$scope.count+'" ng-keyup="getElementId($event)" gm-places-autocomplete name="locations" required id="locations_{{::count}}" ><i class="fa fa-map"></i><div ng-click="closeLocation(count)" id="close_{{::count}}">X</div></span>',
        el = document.getElementById('moreLocations');
        angular.element(el).append( $compile(html)($scope) );
       
        //$("#close_"+(parseInt($scope.count)-1)).hide();
    }
    
    $scope.placeLikeLoader = false;
    /*this is use for like places*/
    $scope.placeLike=function(placeID, index, from){
        $scope.placeLikeLoader = true;
        appServices.postAjax(APP.service.placeLike, { loginSessionKey:localStorage.getItem('loginSessionKey'), placeID : placeID})
            .then(function(response) {
            if(parseInt(response.data.status) === 0){
                $scope.placeLikeLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                if(from=='listdata')
                {
               
                if($scope.my_lists[index].isLiked == 0){
                    $scope.my_lists[index].isLiked = 1;
                }else{
                    $scope.my_lists[index].isLiked = 0;
                }
            }else if(from=='other'){
                 if($scope.otherLists[index].is_like == 0){
                    $scope.otherLists[index].is_like = 1;
                }else{
                    $scope.otherLists[index].is_like = 0;
                }
            }else{
                 if($scope.details.isLiked == 0){
                    $scope.details.isLiked = 1;
                }else{
                    $scope.details.isLiked = 0;
                }
            }
                 $scope.placeLikeLoader = false;
                 appServices.message(APP.message_type_success, response.data.message, $rootScope);
            }
            });
    }
 
    $scope.test = function(img){
        $scope.image = img;
        // $scope.openPopup(id);
        $('#showImageModal').modal('show');
        $('#report').modal('hide');
    }



    $scope.reportPlace = function(id){

        appServices.modalShow(id);
    }

   $scope.placeReportLoader = false;
     $scope.addReport = function(){

        $scope.placeReportLoader = true;
        appServices.postAjax(APP.service.addReport, { loginSessionKey:localStorage.getItem('loginSessionKey'), reasonType : $scope.reportPlaceReason, reasonText:$scope.reasonText , placeID : $stateParams.placeID})
            .then(function(response) {
            if(parseInt(response.data.status) === 0){
                $scope.placeReportLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
                $scope.placeReportLoader = false;
            }
        });
    }

        $scope.pageNo = 1;
        $scope.searchTerm = '';
        $scope.loadMore = false;
        $scope.addMoreLoading = false;
    $scope.otherMylist=function(){
        if($scope.pageNo == 1){
            $rootScope.isLoading = true;
        }else{
            $scope.addMoreLoading = true;
        }
        
        appServices.postAjax(APP.service.otherMylist, { loginSessionKey:localStorage.getItem('loginSessionKey'), pageNo : $scope.pageNo, searchTerm : $scope.searchTerm,placesMyListID:$stateParams.placesMyListID})
            .then(function(response) {
            if(parseInt(response.data.status) === 0){
                $rootScope.isLoading = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
                if($scope.pageNo == 1){
                    $scope.other_mylists = [];
                }
                $scope.addMoreLoading = false;
            }else{
                
                $rootScope.isLoading = false;
                if($scope.pageNo == 1){
                    $scope.other_mylists = response.data.response.places;
                }else{
                    $scope.other_mylists = $scope.other_mylists.concat(response.data.response.places);
                    
                }
                if (response.data.response.totalPlaces > $scope.pageNo*10) {
                    $scope.loadMore = true;
                    $scope.pageNo++;
                }else{
                    $scope.loadMore = false;
                }
                $scope.addMoreLoading = false;
            }
        });
    }

    $scope.createMylistLoader = false;
    $scope.createMylist=function(){
        $scope.createMylistLoader = true;
        appServices.postAjax(APP.service.createMylist, { loginSessionKey:localStorage.getItem('loginSessionKey'), name:$scope.name})
            .then(function(response) {
                console.log(response);
            if(parseInt(response.data.status) === 0){
                $scope.createMylistLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                console.log($scope.getList);
                $scope.getList.push(response.data.response);
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
                $scope.createMylistLoader = false;

            }
        });
    }

    $scope.ratePlace = function(id){

        appServices.modalShow(id);
    }

    $scope.rateUsLoader = false;
     $scope.rateUs = function(placeID){

        $scope.rateUsLoader = true;
        appServices.postAjax(APP.service.rateUs, { loginSessionKey:localStorage.getItem('loginSessionKey'), rating : $scope.ratingUs, placeID : $stateParams.placeID})
            .then(function(response) {
                console.log(response);
            if(parseInt(response.data.status) === 0){
                $scope.rateUsLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                $scope.details.rating=response.data.response.rating ; 
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
                $scope.rateUsLoader = false;
            }
        });
    }

    $scope.shareUrl=function(id,placeID,userID,name){
        $scope.placeID = placeID;
        $scope.userID = userID;
        $scope.placeName = name;
          appServices.modalShow(id);
    }
    $scope.addLists = function(id,placeID){
        $scope.placeID = placeID;
        appServices.modalShow(id);
    }
    $scope.addListViews = function(id){
        appServices.modalShow(id);
    }

    $scope.getMylistLoader = false;
    $scope.getMylisting=function(){
        $scope.getMylistLoader = true;
        appServices.postAjax(APP.service.getMylisting, { loginSessionKey:localStorage.getItem('loginSessionKey'), userID : $scope.userInfo.userID})
            .then(function(response) {
                console.log(response);
            if(parseInt(response.data.status) === 0){
                $scope.getMylistLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                $scope.getList=response.data.response;
                /*appServices.message(APP.message_type_success, response.data.message, $rootScope);*/
                $scope.getMylistLoader = false;
            }
        });
    }


            addMylistLoader=false;
        $scope.addMylist=function(placesMyListID,index,placeID){
            addMylistLoader=true;
             appServices.postAjax(APP.service.addMylist, { loginSessionKey:localStorage.getItem('loginSessionKey'), placesMyListID :placesMyListID, placeID : placeID})
            .then(function(response) {
                console.log(response);
            if(parseInt(response.data.status) === 0){
                $scope.addMylistLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                $scope.getList[index].total_count=$scope.getList[index].total_count+1;
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
                $scope.addMylistLoader = false;
            }
        });
    }

            checkedInLoader=false;
        $scope.checkedIn=function(placeID,index){
            checkedInLoader=true;
            appServices.postAjax(APP.service.checkedIn, { loginSessionKey:localStorage.getItem('loginSessionKey'), placeID : placeID})
            .then(function(response) {
                console.log(response);
            if(parseInt(response.data.status) === 0){

                $scope.checkedInLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                $scope.my_lists.splice(index, 1);
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
                $scope.checkedInLoader = false;
            }
        });

        }

        $scope.placeDetailLoader = false;
      $scope.placeDetail = function(){
        $scope.placeDetailLoader = true;
        appServices.postAjax(APP.service.placeDetail, { loginSessionKey:localStorage.getItem('loginSessionKey'), placeID : $stateParams.placeID })
            .then(function(response) {
            if(parseInt(response.data.status) === 0){
                $scope.placeDetailLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{

                $scope.details=response.data.response.detail;
               /* appServices.message(APP.message_type_success,response.data.message, $rootScope);*/
                $scope.placeDetailLoader = false;
            }
        });
    }


    $scope.addPlacephoto=function(){
        $timeout(function() {
            $("#photos").trigger('click');
             }, 10);
    }

            $scope.placePhotoLoader = false;
        $scope.placePhoto=function(){
            $scope.placePhotoLoader = true;
             var fd = new FormData();
            fd.append('loginSessionKey', localStorage.getItem('loginSessionKey'));  
            fd.append('photos', document.getElementById('photos').files[0]);
            fd.append('placeID', $stateParams.placeID);
            appServices.fileUpload(APP.service.placePhoto, fd)
            .then(function(response) {
                console.log(response);
            if(parseInt(response.data.status) === 0){
                $scope.placePhotoLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                console.log($scope.details.placesPhotos);
               $scope.details.placesPhotos.push(response.data.response);
                $scope.placePhotoLoader = false;
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
            }
        });
        }
    /*this is use for checkIn*/

     $scope.placeCheckinLoader = false;
      $scope.checkIn = function(){
        $scope.placeCheckinLoader = true;
        appServices.postAjax(APP.service.checkIn, { loginSessionKey:localStorage.getItem('loginSessionKey'), placeID : $stateParams.placeID})
            .then(function(response) {
           
            if(parseInt(response.data.status) === 0){
                $scope.placeCheckinLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                if($scope.details.isCheckedIn == 0){
                    $scope.details.isCheckedIn = 1;
                }
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
                $scope.placeCheckinLoader = false;
            }
        });
    }

            
        
            /*$scope.placePhotoLoader = false;
        $scope.placePhoto=function(){
            $scope.placePhotoLoader = true;
             var fd = new FormData();
            fd.append('loginSessionKey', localStorage.getItem('loginSessionKey'));
            fd.append('photos', document.getElementById('photos').files[0]);
            fd.append('placeID', $stateParams.placeID);
            appServices.fileUpload(APP.service.placePhoto, fd)
            .then(function(response) {
                console.log(response);
            if(parseInt(response.data.status) === 0){
                $scope.placePhotoLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                $scope.placePhotoLoader = false;
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
            }
        });
        }*/

    /*$scope.uploadImage = function(){
        $timeout(function() {
            $("#originalCommentImage").trigger('click');
        }, 10);  
    }
*/
    $scope.addCommentImage=function(){
        $timeout(function() {
            $("#originalCommentImage").trigger('click');
        }, 10);  
    }
    /*this is use for addComment*/
      $scope.addCommentLoader = false;
      $scope.addComment = function(){

        
        $scope.addCommentLoader = true;      
        var fd = new FormData();
        fd.append('loginSessionKey', localStorage.getItem('loginSessionKey'));
        fd.append('originalCommentImage', document.getElementById('originalCommentImage').files[0]);
        fd.append('placeID', $stateParams.placeID);
        fd.append('comment', $scope.Comment);
        appServices.fileUpload(APP.service.addComment, fd)
            .then(function(response) {
                console.log(response);
            if(parseInt(response.data.status) === 0){
                $scope.addCommentLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                $scope.addCommentLoader = false;
                console.log(response.data.response);
                if($scope.userInfo.userFirstName){
                    response.data.response.userFirstName = $scope.userInfo.userFirstName;
                }else{
                    response.data.response.userFirstName = $scope.userInfo.userEmailID;
                }
                
                response.data.response.userLastName = $scope.userInfo.userLastName;
                response.data.response.userEmailID = $scope.userInfo.userEmailID;
                response.data.response.imagePath = $scope.userInfo.imagePath;
                response.data.response.thumbImagePath = $scope.userInfo.thumbImagePath;
                response.data.response.is_comment_like = 0;
                
                $scope.comm_List.unshift(response.data.response);
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
                $scope.Comment = null;

            }
        });
    }
        $scope.pageNo = 1;
        $scope.loadMore = false;
        $scope.commentListLoader = false;
        $scope.comm_List = [];
      $scope.commentList = function(){
          if($scope.pageNo == 1){
            $rootScope.isLoading = true;
        }else{
            $scope.commentListLoader = true;
        }
        appServices.postAjax(APP.service.commentList, { loginSessionKey:localStorage.getItem('loginSessionKey'), placeID : $stateParams.placeID , pageNo :$scope.pageNo  })
            .then(function(response) {
            if(parseInt(response.data.status) === 0){
                $rootScope.isLoading = false;
                if($scope.pageNo == 1){
                    $scope.comm_List = [];
                }
                $scope.commentListLoader = false;
           
               /* appServices.message(APP.message_type_error, response.data.message, $rootScope);*/
            }else{
                
                $rootScope.isLoading = false;
                if($scope.pageNo == 1){
                    $scope.comm_List = response.data.response.comments;
                }else{
                    $scope.comm_List = $scope.comm_List.concat(response.data.response.comments);
                    
                }
                if (response.data.response.totalComment> $scope.pageNo*10) {
                    $scope.loadMore = true;
                    $scope.pageNo++;
                }else{
                    $scope.loadMore = false;
                }
                $scope.commentListLoader = false;
            }
        });
    }

    $rootScope.clickCategory=function(categoryID,index){
        console.log($rootScope.categoriesLists[index].categoryID);
        $scope.categoryID=$rootScope.categoriesLists[index].categoryID;
        $scope.pageNo = 1;
        $scope.otherLists = [];
        $scope.otherList();
        
    };
    $scope.searchType=function(clickType,clickNum,className){
        
     $scope.activeClass = className;

        if(clickType=='orderType')
        {
            $scope.orderType=clickNum;
        }
        else if(clickType=='price')
        {
            $scope.price=clickNum; 
        }
        else
        {
            $scope.rating=clickNum;
        }
        $scope.otherList();
        
    }

    
    
        $scope.activeClass = 'near_me';
    $scope.nearMe = function(near_me,className) {
        $scope.activeClass = className;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            $scope.$evalAsync(function() {
                $scope.latitude = position.coords.latitude;
                $scope.longitude = position.coords.longitude;
                console.log($scope.latitude);
                console.log($scope.longitude);    
            })
        })
    }
        $scope.otherList();
        }

         $scope.activeClass = 'near_me';
    $rootScope.clickSearch=function(searchPlace){
        $scope.searchTerm=searchPlace;
        console.log($scope.searchTerm);
        $scope.otherList();
        $scope.searchPlace=null;
    };

        $scope.initialize = function() {

        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {

            $scope.$evalAsync(function() {
                $scope.latitude = position.coords.latitude;
                $scope.longitude = position.coords.longitude;
                console.log($scope.latitude)
                console.log($scope.longitude)
            var mymap = new google.maps.Map(document.getElementById('map_div'), {
            center: {lat: $scope.latitude, lng: $scope.longitude},
            zoom: 14

        });
          var marker= new google.maps.Marker({
          map: mymap,
          position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
        });
        })   
        })
      }

    }    
          google.maps.event.addDomListener(window, 'load', $scope.initialize);


        
    
    /*this is for other list*/
    $scope.categoryID=[];
    $scope.otherLists = [];
    $scope.price="";
    $scope.searchTerm="";
    $scope.pageNo = 1;
    $scope.orderType="";
    $scope.rating="";
    $scope.latitude=[];
    $scope.longitude=[];
    $scope.loadMore = false;
    $scope.otherListLoader= false;

 $scope.otherList=function(){

     if($scope.pageNo == 1){
            $rootScope.isLoading = true;
        }else{
            $scope.otherListLoader = true;
        }
     appServices.postAjax(APP.service.otherList, { loginSessionKey:localStorage.getItem('loginSessionKey'), pageNo : $scope.pageNo, searchTerm:$scope.searchTerm,categoryID:$scope.categoryID,price:$scope.price,orderType:$scope.orderType,rating:$scope.rating,latitude:$scope.latitude,longitude:$scope.longitude})
            .then(function(response) {
                 
                console.log(response.data.response);
            if(parseInt(response.data.status) === 0){
                 
                $rootScope.isLoading = false;
                $scope.otherListLoader = false;

                 if($scope.pageNo == 1){
                    $scope.otherLists = [];
                    $scope.apply();
                    var input=[];
                }
                $scope.otherListLoader = false;
                /*appServices.message(APP.message_type_error, response.data.message, $rootScope);*/
            }else{
                $rootScope.isLoading = false;
               
                if($scope.pageNo == 1){

                    $scope.otherLists = response.data.response.placesObj;
                   
                }else{
                    
                    $scope.otherLists = $scope.otherLists.concat(response.data.response.placesObj);
                    $scope.categoryID.push(response.data.response.placesObj);
                    $scope.orderType.push(response.data.response.placesObj);
                    $scope.price.push(response.data.response.placesObj);
                    $scope.rating.push(response.data.response.placesObj);
                    
                    }
                if (response.data.response.totalPlaces> $scope.pageNo*10) {
                    $scope.loadMore = true;
                    $scope.pageNo++;
                }else{
                    $scope.loadMore = false;
                }
                $scope.otherListLoader = false;
               /* appServices.message(APP.message_type_success, response.data.message, $rootScope)*/;
            }
        });

 }

 /*this is for delete comment*/
$scope.commentDeleteLoader = false;
    $scope.deleteComment=function(commentID, index){
$scope.commentDeleteLoader = true;
          appServices.postAjax(APP.service.deleteComment, { loginSessionKey:localStorage.getItem('loginSessionKey'), placeID : $stateParams.placeID, commentID : commentID})
            .then(function(response) {
              
            if(parseInt(response.data.status) === 0){
                $scope.commentDeleteLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                $scope.commentDeleteLoader = false;               
                $scope.comm_List.splice(index, 1);
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
            }
        });
    }

/*this is for like Comment*/
$scope.likeCommentLoader = false;
$scope.likeComment=function(commentID, index){
    $scope.likeCommentLoader = true;
        appServices.postAjax(APP.service.likeComment, { loginSessionKey:localStorage.getItem('loginSessionKey'), commentID : commentID})
            .then(function(response) {
                console.log(response);
            if(parseInt(response.data.status) === 0){
                $scope.likeCommentLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                $scope.likeCommentLoader = false;
 
                if($scope.comm_List[index].is_comment_like == 0){
                    $scope.comm_List[index].is_comment_like = 1;
                }else{
                    $scope.comm_List[index].is_comment_like = 0;
                }
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
            }
            }
            
        );
}
 $scope.placeSaveLoader = false;
    /*this is use for save place*/
    $scope.placeSave=function(placeID, index, from){
        $scope.placeSaveLoader = true;
        appServices.postAjax(APP.service.placeSave, { loginSessionKey:localStorage.getItem('loginSessionKey'), placeID : placeID})
            .then(function(response) {
                console.log(response);
                console.log($scope.details);
            if(parseInt(response.data.status) === 0){
                $scope.placeSaveLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);

            }else{ 
              if(from=='list'){
                if($scope.my_lists[index].isSaved == 0){
                    $scope.my_lists[index].isSaved = 1;
                }else{
                    $scope.my_lists[index].isSaved = 0;
                }
              }else{
                console.log('$scope.details',$scope.details);
                if($scope.details.isSaved == 0){
                    $scope.details.isSaved = 1;
                }else{
                    $scope.details.isSaved = 0;
                }
              }
           

                $scope.placeSaveLoader = false;
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
            }
            }
            
        );
    }
    
        $scope.deleteCreatelistLoader = false;
    $scope.deleteCreatelist=function(placesAddMyListID,index){
        $scope.deleteCreatelistLoader = true;
        appServices.postAjax(APP.service.deleteCreatelist, { loginSessionKey:localStorage.getItem('loginSessionKey'), placesAddMyListID : placesAddMyListID})
            .then(function(response) {
            if(parseInt(response.data.status) === 0){
                $scope.deleteCreatelistLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{

                $scope.other_mylists.splice(index, 1); 
                $scope.deleteCreatelistLoader = false;
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
            }
        });

    }


    $scope.placeDeleteLoader = false;
    /*this is use for delete place*/
    $scope.placeDelete=function(placeID, index, from){
        $scope.placeDeleteLoader = true;
        appServices.postAjax(APP.service.placeDelete, { loginSessionKey:localStorage.getItem('loginSessionKey'), placeID : placeID})
            .then(function(response) {
            if(parseInt(response.data.status) === 0){
                $scope.placeDeleteLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                
                   $scope.my_lists.splice(index, 1); 

                
                $scope.placeDeleteLoader = false;
                
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
            }
        });
    }
    $scope.getElementId = function(event){
        console.log(event.target.ngModel)
        $scope.elementId = event.target.id;
        var address = $("#"+$scope.elementId).val();
        if(address.length > 3){
            $scope.addMoreLocation = true;
        }
        index = $scope.placeFormData.locations.indexOf(address);
        
        if(index == -1){
            arrayIndex = $scope.elementId.split('locations_');
            arrayIndex = arrayIndex[arrayIndex.length-1];
            arrayIndex = arrayIndex-1;
            $scope.placeFormData.locations[arrayIndex] = address;
            $scope.placeFormData.latitudes[arrayIndex] = '';
            $scope.placeFormData.longitudes[arrayIndex] = '';
             console.log($scope.placeFormData)
        }
    }
    $scope.closeLocation = function(count){
        $scope.addMoreLocation = true;
        $("#remove_"+count).remove();
     
        if(count != 1){
            $("#close_"+(parseInt(count)-1)).show();
        }
        console.log(count)
        count = parseInt(count)-1;
        $scope.placeFormData.locations.splice(count, 1);
        $scope.placeFormData.latitudes.splice(count, 1);
        $scope.placeFormData.longitudes.splice(count, 1);
        console.log($scope.placeFormData.locations)

        $scope.count--;
    }
    $scope.workingdays = true;
    $scope.toggleDays = function(){
        if($scope.workingdays){
            $scope.workingdays = false;
        }else{
            $scope.workingdays = true;
        }
    }
   $scope.coverPhoto = function(id, photoID){
        appServices.showImage(id); 
        if($stateParams.placeID){
            if(photoID){
                $scope.changePhotos.push(photoID);
            }else{
                $scope.changePhotos.push(0);
            }

        } 
       
    }
    $scope.lat = undefined;
    $scope.lng = undefined;

    $scope.$on('gmPlacesAutocomplete::placeChanged', function(){
        $scope.addMoreLocation = true;
        
        var address = $("#"+$scope.elementId).val();
        index = $scope.placeFormData.locations.indexOf(address);
        
        if(index == -1){
            arrayIndex = $scope.elementId.split('locations_');
            arrayIndex = arrayIndex[arrayIndex.length-1];
            arrayIndex = arrayIndex-1;
           
            if(arrayIndex == 0){
                var location = $scope.autocomplete_1.getPlace().geometry.location;
            }
            if(arrayIndex == 1){
                var location = $scope.autocomplete_2.getPlace().geometry.location;
            }
            if(arrayIndex == 2){
                var location = $scope.autocomplete_3.getPlace().geometry.location;
            }
            if(arrayIndex == 3){
                var location = $scope.autocomplete_4.getPlace().geometry.location;
            }
            if(arrayIndex == 4){
                var location = $scope.autocomplete_5.getPlace().geometry.location;
            }
             
            $scope.placeFormData.locations[arrayIndex] = address;
            $scope.placeFormData.latitudes[arrayIndex] = location.lat();
            $scope.placeFormData.longitudes[arrayIndex] = location.lng();
        }else{
            $scope.addMoreLocation = false;
            $("#"+$scope.elementId).val('');
        }
       
        console.log($scope.placeFormData)
        $scope.$apply();
    });
    $scope.addPhoto = false;
    $scope.Data = {};
    $scope.addPlacesTest = function(){
        $scope.addPlaceLoader = true;
        for (var i = 0; i < $scope.placeFormData.latitudes.length; i++) {
            (function(i){
                console.log($scope.placeFormData.latitudes[i])
                if(!$scope.placeFormData.latitudes[i]){
                    address = $scope.placeFormData.locations[i];
                    if(address){
                        // Initialize the Geocoder
                        geocoder = new google.maps.Geocoder();
                        if (geocoder) {
                            geocoder.geocode({
                                'address': address
                            }, function (results, status) {
                                if (status == google.maps.GeocoderStatus.OK) {
                                    $scope.placeFormData.latitudes[i] = results[0].geometry.location.lat();
                                    $scope.placeFormData.longitudes[i] = results[0].geometry.location.lng();
                                    console.log(results[0].geometry.location.lng())
                                    if($scope.placeFormData.latitudes.length-1 == i){
                                        $scope.addPlaces();
                                    }
                                }
                            });
                        }
                    }
                      
                }else{
                    if($scope.placeFormData.latitudes.length-1 == i){
                        $scope.addPlaces();
                    }
                    
                }
            })(i);   
        }
    }
    $scope.addPlaces = function(){
        
        $scope.placeFormData.loginSessionKey = localStorage.getItem('loginSessionKey');
        console.log(JSON.stringify($scope.placeFormData))
        $scope.data = $scope.placeFormData;
        addTags = []
        if($scope.placeFormData.addTags){
            if($scope.placeFormData.addTags.search(',') != -1)
            {
                
                addTags = $scope.placeFormData.addTags;
                addTags = addTags.split(',');
            }else{
               
                addTags.push($scope.placeFormData.addTags);
            }
           
        }
        console.log($scope.Data.coverPhoto+"--------phgh")
        var coverPhoto = $scope.Data.coverPhoto;
        var photos = [];
        var fd = new FormData();
        if($scope.Data.coverPhoto1){
            fd.append('photos', $scope.Data.coverPhoto1);
        }
        if($scope.Data.coverPhoto2){
            fd.append('photos', $scope.Data.coverPhoto2);
        }
        if($scope.Data.coverPhoto3){
            fd.append('photos', $scope.Data.coverPhoto3);
        }
        if($scope.Data.coverPhoto4){
            fd.append('photos', $scope.Data.coverPhoto4);
        }
        if($scope.Data.coverPhoto5){
            fd.append('photos', $scope.Data.coverPhoto5);
        }
        
        fd.append('loginSessionKey', localStorage.getItem('loginSessionKey'));
        fd.append('categoryID', $scope.data.categoryID);
        fd.append('name', $scope.data.name);
        fd.append('serviceType', $scope.data.serviceType);
        fd.append('orderType', $scope.data.orderType);
        fd.append('price', $scope.data.price);
        if($scope.data.phoneNo){
            fd.append('phoneNo', $scope.data.phoneNo);
        }
        if($scope.data.whatsAppNo){
            fd.append('whatsAppNo', $scope.data.whatsAppNo);
        }
        fd.append('email', $scope.data.email);
        fd.append('locations', JSON.stringify($scope.data.locations));
        fd.append('latitudes', JSON.stringify($scope.data.latitudes));
        fd.append('longitudes', JSON.stringify($scope.data.longitudes));
        if($scope.data.facebookURL){
            fd.append('facebookURL', $scope.data.facebookURL);
        }
        if($scope.data.twitterURL){
            fd.append('twitterURL', $scope.data.twitterURL);
        }
        
        fd.append('isOpenForAllDays', $scope.data.isOpenForAllDays);
        if($scope.data.isOpenForAllDays == 1){
            $scope.data.isMondayOn = 1;
            $scope.data.mondayStartTime = $scope.data.starttimepicker;
            $scope.data.mondayEndTime = $scope.data.endtimepicker;
            $scope.data.isTuesdayOn = 1;
            $scope.data.tuesdayStartTime = $scope.data.starttimepicker;
            $scope.data.tuesdayEndTime = $scope.data.endtimepicker;
            $scope.data.isWenesdayOn = 1;
            $scope.data.wenesdayStartTime = $scope.data.starttimepicker;
            $scope.data.wenesdayEndTime = $scope.data.endtimepicker;
            $scope.data.isThursdayOn = 1;
            $scope.data.thursdayStartTime = $scope.data.starttimepicker;
            $scope.data.thursdayEndTime = $scope.data.endtimepicker;
            $scope.data.isFridayOn = 1;
            $scope.data.fridayStartTime = $scope.data.starttimepicker;
            $scope.data.fridayEndTime = $scope.data.endtimepicker;
            $scope.data.isSaturdayOn = 1;
            $scope.data.saturdayStartTime = $scope.data.starttimepicker;
            $scope.data.saturdayEndTime = $scope.data.endtimepicker;
            $scope.data.isSundayOn = 1;
            $scope.data.sundayStartTime = $scope.data.starttimepicker;
            $scope.data.sundayEndTime = $scope.data.endtimepicker;
        }
        fd.append('isMondayOn', $scope.data.isMondayOn);
        fd.append('mondayStartTime', $scope.data.mondayStartTime);
        fd.append('mondayEndTime', $scope.data.mondayEndTime);
        fd.append('isTuesdayOn', $scope.data.isTuesdayOn);
        fd.append('tuesdayStartTime', $scope.data.tuesdayStartTime);
        fd.append('tuesdayEndTime', $scope.data.tuesdayEndTime);
        fd.append('isWenesdayOn', $scope.data.isWenesdayOn);
        fd.append('wenesdayStartTime', $scope.data.wenesdayStartTime);
        fd.append('wenesdayEndTime', $scope.data.wenesdayEndTime);
        fd.append('isThursdayOn', $scope.data.isThursdayOn);
        fd.append('thursdayStartTime', $scope.data.thursdayStartTime);
        fd.append('thursdayEndTime', $scope.data.thursdayEndTime);
        fd.append('isFridayOn', $scope.data.isFridayOn);
        fd.append('fridayStartTime', $scope.data.fridayStartTime);
        fd.append('fridayEndTime', $scope.data.fridayEndTime);
        fd.append('isSaturdayOn', $scope.data.isSaturdayOn);
        fd.append('saturdayStartTime', $scope.data.saturdayStartTime);
        fd.append('saturdayEndTime', $scope.data.saturdayEndTime);
        fd.append('isSundayOn', $scope.data.isSundayOn);
        fd.append('sundayStartTime', $scope.data.sundayStartTime);
        fd.append('sundayEndTime', $scope.data.sundayEndTime);
        fd.append('coverPhoto', coverPhoto);
        console.log(coverPhoto+"coverPhoto")
        if(photos.length > 0){
            console.log(photos.length+"----------")
            //fd.append('photos', photos);
        }
        if($scope.data.descprition){
            fd.append('descprition', $scope.data.descprition);
        }
        
        if(addTags.length > 0){
            fd.append('tags', JSON.stringify(addTags));
        }
        
        
        
        appServices.fileUpload(APP.service.placeAdd, fd)
            .then(function(response) {
            if(parseInt(response.data.status) === 0){
                $scope.addPlaceLoader = false;
                appServices.message(APP.message_type_error, response.data.message, $rootScope);
            }else{
                appServices.message(APP.message_type_success, response.data.message, $rootScope);
                $scope.addPlaceLoader = false;
                $location.path('my-places');
            }
        });
            
    }

    $scope.listone = "";
    $scope.listtwo = "one,two,three";
    $scope.listthree = "";
    $scope.addTime = true;
    $scope.$watch('placeFormData', function(){
        console.log('fghghgh')
        if ($scope.placeFormData.starttimepicker && $scope.placeFormData.endtimepicker) {
            if ($scope.placeFormData.starttimepicker < $scope.placeFormData.endtimepicker) {
                $("#starttimepicker").hide();
                $scope.addTime = false;
            }else{
                $("#starttimepicker").show(); 
                $scope.addTime = true;
            }
        }

        if($scope.placeFormData.mondayStartTime && $scope.placeFormData.mondayEndTime){
            if ($scope.placeFormData.mondayStartTime < $scope.placeFormData.mondayEndTime) {
                $("#isMondayOn").hide();
                $scope.addTime = false;
            }else{
                $("#isMondayOn").show(); 
                $scope.addTime = true;
            }
        }

        if($scope.placeFormData.tuesdayStartTime && $scope.placeFormData.tuesdayEndTime){
            if ($scope.placeFormData.tuesdayStartTime < $scope.placeFormData.tuesdayEndTime) {
                $("#isTuesdayOn").hide();
                $scope.addTime = false;
            }else{
                $("#isTuesdayOn").show();
                $scope.addTime = true; 
            }
        }

        if($scope.placeFormData.wenesdayStartTime && $scope.placeFormData.wenesdayEndTime){
            if ($scope.placeFormData.wenesdayStartTime < $scope.placeFormData.wenesdayEndTime) {
                $("#isWenesdayOn").hide();
                $scope.addTime = false;
            }else{
                $("#isWenesdayOn").show(); 
                $scope.addTime = true;
            }
        }

        if($scope.placeFormData.thursdayStartTime && $scope.placeFormData.thursdayEndTime){
            if ($scope.placeFormData.thursdayStartTime < $scope.placeFormData.thursdayEndTime) {
                $("#isThursdayOn").hide();
                $scope.addTime = false;
            }else{
                $("#isThursdayOn").show();
                $scope.addTime = true; 
            }
        }

        if($scope.placeFormData.fridayStartTime && $scope.placeFormData.fridayEndTime){
            if ($scope.placeFormData.fridayStartTime < $scope.placeFormData.fridayEndTime) {
                $("#isFridayOn").hide();
                $scope.addTime = false;
            }else{
                $("#isFridayOn").show(); 
                $scope.addTime = true;
            }
        }

        if($scope.placeFormData.saturdayStartTime && $scope.placeFormData.saturdayEndTime){
            if ($scope.placeFormData.saturdayStartTime < $scope.placeFormData.saturdayEndTime) {
                $("#isSaturdayOn").hide();
                $scope.addTime = false;
            }else{
                $("#isSaturdayOn").show(); 
                $scope.addTime = true;
            }
        }

        if($scope.placeFormData.sundayStartTime && $scope.placeFormData.sundayEndTime){
            if ($scope.placeFormData.sundayStartTime < $scope.placeFormData.sundayEndTime) {
                $("#isSundayOn").hide();
                $scope.addTime = false;
            }else{
                $("#isSundayOn").show(); 
                $scope.addTime = true;
            }
        }
    },true);
    
    $scope.pageNo = 1;
    $scope.searchTerm = '';
    $scope.loadMore = false;
    $scope.addMoreLoading = false;
    $scope.myLists = function(type){
        let usrID='';
        if($scope.userInfo.userID != $stateParams.userID )
        {
            usrID = $stateParams.userID;
        }     
        $scope.usrID = usrID;
        
        let userID = '';
        if($scope.userInfo.userID = $stateParams.userID )
        {
            userID = $stateParams.userID;
        }    
        $scope.userID = userID;

        if($scope.pageNo == 1){
            $rootScope.isLoading = true;
        }else{
            $scope.addMoreLoading = true;
        }

        appServices.postAjax(APP.service.myList, { loginSessionKey:localStorage.getItem('loginSessionKey'), listType : type, pageNo : $scope.pageNo, searchTerm : $scope.searchTerm, userID : $scope.userInfo.userID})
            .then(function(response) {
            if(parseInt(response.data.status) === 0){
                $rootScope.isLoading = false;
               /* appServices.message(APP.message_type_error, response.data.message, $rootScope);*/
                if($scope.pageNo == 1){
                    $scope.my_lists = [];
                }
                $scope.addMoreLoading = false;
            }else{
                $rootScope.isLoading = false;
                if($scope.pageNo == 1){
                    $scope.my_lists = response.data.response.places;
                }else{
                    $scope.my_lists = $scope.my_lists.concat(response.data.response.places);
                }
                if (response.data.response.totalPlaces > $scope.pageNo*10) {
                    $scope.loadMore = true;
                    $scope.pageNo++;
                }else{
                    $scope.loadMore = false;
                }
                
                $scope.addMoreLoading = false;
            }
        });
    }
}])

   
    
    

