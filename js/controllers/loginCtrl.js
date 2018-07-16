app.controller('loginCtrl', ['$rootScope', '$scope', 'appServices', '$http', '$state', '$stateParams', '$location','$q','$translate', function($rootScope, $scope, appServices, $http, $state, $stateParams, $location,$q,$translate) {
      $scope.switchLanguage = function(key) {
      $translate.use(key);
    };

	/* For admin login */
	$scope.login = function() {
	    let userEmail = $scope.userEmail;
	    let userPassword = $scope.userPassword;
	    $scope.errorMessage   = false;
	    $scope.successMessage = false;
	    $scope.isLoading      = true;
          appServices.postAjax(APP.service.adminLogin, { userEmail:userEmail,userPassword:userPassword })
            .then(function(response) {
            	if(parseInt(response.data.status) === 0){
            		$scope.errorMessage = response.data.message;
            		$scope.isLoading      = false;
            	}else{
            		$scope.errorMessage   = false;
            		$scope.successMessage = response.data.message;
                        localStorage.setItem('loginSessionKey',response.data.response.loginSessionKey);
                        localStorage.setItem('isloggedIn',true);
                        localStorage.setItem('userType',1);
                        window.location.href = origin + "admin/dashboard";
            	}
            })
	}

}]);