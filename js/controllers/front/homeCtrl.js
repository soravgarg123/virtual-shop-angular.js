app.controller('homeCtrl', ['$rootScope', '$scope', 'appServices', '$http', '$state', '$stateParams', '$location','$q','$translate', function($rootScope, $scope, appServices, $http, $state, $stateParams, $location,$q,$translate) {
	$scope.switchLanguage = function(key) {
      $translate.use(key);
    };
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
        

}]);