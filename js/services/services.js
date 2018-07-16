/****************************************************************************************************************
                                
                                                     App factory

****************************************************************************************************************/

/* To get user timezone details */
var offset    = new Date().getTimezoneOffset();
    offset    = offset.toString();
var plusSign  = offset.indexOf("+");
var minusSign = offset.indexOf("-");
var timeZoneObj  = {};
timeZoneObj.offset = offset;
if(plusSign > -1){
    timeZoneObj.identifire   = "-";
    timeZoneObj.totalMinutes = parseInt(offset.replace("+",""));
}else if(minusSign > -1){
    timeZoneObj.identifire = "+";
    timeZoneObj.totalMinutes = parseInt(offset.replace("-",""));
}else{
    timeZoneObj.identifire = "-";
    timeZoneObj.totalMinutes = parseInt(offset);
}
let totalMinutes = timeZoneObj.totalMinutes;
let totalHours   = parseInt(totalMinutes/60);
let hourMinutes  = 60 * totalHours;
let reaminingMinutes = totalMinutes - hourMinutes;
timeZoneObj.totalHours  = totalHours;
timeZoneObj.hourMinutes = hourMinutes;
timeZoneObj.reaminingMinutes = reaminingMinutes;
timeZoneObj.finalTimeZoneFormatted = ((totalHours > 10) ? totalHours : "0" + totalHours) + ":" + ((reaminingMinutes > 10) ? reaminingMinutes : "0" + reaminingMinutes);


app.factory('appServices', function($http, $rootScope, $timeout, $interval) {
    return {
        post: function(url, opt) {
            return $http({
                method: "POST",
                url: url,
                data: opt
            });
        }, //post
        postAjax: function(url, opt) {
           
            return $http({
                method: "POST",
                url: url,
                headers: {
                    'locale':'en',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function(obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: opt
            });
        }, //postAjax
        get: function(url, opt) {
            return $http({
                method: "GET",
                url: url,
                cache: true,
                params: opt
            });
        }, //success and error message
        message: function(type, message, $rootScope) {
            $rootScope.messageType = type;
            $rootScope.message = message;
            $timeout(function(){
                $rootScope.messageType = '';
            },APP.timeout_duration);
        } , //timer
        resendTimer: function(resendCodeLimit, $scope) {
            localStorage.setItem('resendCodeLimit', 0);
            $scope.timer = resendCodeLimit;
            var count = 0;
            var interval = $interval(function(){
                $scope.timer = resendCodeLimit-count;
                count++;
            },1000);
            $timeout(function() {
                $scope.timer = '';
                $interval.cancel(interval);
                $scope.resendLoader = false;
            }, resendCodeLimit*1000);
        }, //getUserInfo
        getUserInfo: function(callback) {
            if(localStorage.getItem('profileResp')){
                userInfo = JSON.parse(localStorage.getItem('profileResp'));
            }else{
                userInfo = '';
            }
            callback(userInfo);
        }, //post
        fileUpload: function(url, opt) {
            
            return $http({
                method: "POST",
                url: url,
                headers: {
                    'Content-Type': undefined
                },
                data: opt
            });
        }, //modalShow
        modalShow: function(id) {
            $("#"+id).modal("show");
        }, //modalHide
        modalHide: function(id) {
            $("#"+id).modal("hide");
        }, //showImage
        showImage: function(id) {
            $("#"+id).trigger('click');
        },tabShow: function(id) {
            $("#"+id).tab("show");
        }, //modalHide
        tabHide: function(id) {
            $("#"+id).tab("hide");
        },
        
    };
});

/****************************************************************************************************************
                                
                                                    custom App Filters

****************************************************************************************************************/

app.filter('parseDate', function() {
    return function(value) {
        return Date.parse(value);
    };
});

app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

app.filter('capitalize_replace', function() {
    return function(input) {
      let str1 =  (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
      let str2 =  str1.replace(/_/g," ");
      let words = str2.toLowerCase().split(' ');
      for(var i = 0; i < words.length; i++) {
          var letters = words[i].split('');
          letters[0] = letters[0].toUpperCase();
          words[i] = letters.join('');
      }
      return words.join(' ');
    }
});

app.filter('startFrom', function() {
    return function(input, start) {
        if(input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    }
});

/* To convert datetime into user timezone */
app.filter('convertIntoUserTimeZone', function() {
    return function(input) {
        let identifire   = timeZoneObj.identifire;
        let totalMinutes = timeZoneObj.totalMinutes;
        var utcTime      = '';
        if (identifire === '+') {
            utcTime = moment(input).add(totalMinutes, 'minutes');
        } else {
            utcTime = moment(input).subtract(totalMinutes, 'minutes');
        }
        utcTime = moment(utcTime).format("LLL"); // March 19, 2018 4:04 PM
        return utcTime;
    }
});

app.filter('toMinSec', function(){
    return function(input){
        if(!input){
            return;
        }
        var minutes = parseInt(input/60, 10);
        var seconds = input%60;
        
        if(minutes < 10){
            minutes = '0'+minutes;
        }
        if(seconds < 10){
            seconds = '0'+seconds;
        }
        return minutes+':'+ seconds;
    }
})

app.filter('to_trusted', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);
app.filter('myDate', function($filter)
{
    return function(input)
    {
        if(!input){ return ""; }
        var _date = $filter('date')(new Date(input), 'dd MMMM HH:mm:ss');
        return _date.toUpperCase();
    };
});
app.filter('myDatee', function($filter)
{
    return function(input)
    {

        if(!input){ return ""; }
        var _date = $filter('date')(new Date(input), 'dd MMMM');
        if(_date){
           
            return _date.toUpperCase();
        }
        
    };
});
app.filter("asDate", function () {
    return function (input) {
        return new Date(input);
    }
});
app.filter('nospace', function() {
    return function(string) {
        
        var word = string.toString().trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
        
        return word;
    };
});


