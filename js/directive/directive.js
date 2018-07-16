"use strict";
app.directive('popupHandler', function() { 
  return { 
    restrict: 'A', 
    link: function($scope,element) {
          $scope.closePopup = function(id){ 
            if($('#'+id).find('.close').length>0) {
              $('#'+id).trigger('click');
            } 
            else {
              $('#'+id).remove();
            }
            if($('.modal-backdrop').length>0) {
              $('.modal-backdrop').remove();
            } 
            $('body').removeClass('modal-open').css('padding-right',""); 
          }; 
          $scope.openPopup = function(id){  
            var popup = $('#'+id);
            alert(id)
            $('#'+id).modal('show');
          }; 
    }, 
  } 
});


app.directive('showPassword', function() {
    return {
        link: function($scope, element, attrs) {
            $scope.showPassword= function() {
                if($scope.type == 'password'){
                	$scope.type = 'text';
                }else{
                	$scope.type = 'password';
                }
            }
        }
    }
});
app.directive('currentShowPassword', function() {
    return {
        link: function($scope, element, attrs) {
            $scope.showCurrentPassword = function() {
                if($scope.currentType == 'password'){
                  $scope.currentType = 'text';
                }else{
                  $scope.currentType = 'password';
                }
            }
        }
    }
});
app.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
app.directive('validNumber', function() {
    return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
          if(!ngModelCtrl) {
            return; 
          }
          ngModelCtrl.$parsers.push(function(val) {
            if (angular.isUndefined(val)) {
                var val = '';
            }           
            var clean = val.replace(/[^-0-9\.]/g, '');
            var negativeCheck = clean.split('-');
            var decimalCheck = clean.split('.');
            if(!angular.isUndefined(negativeCheck[1])) {
                negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                clean =negativeCheck[0] + '-' + negativeCheck[1];
                if(negativeCheck[0].length > 0) {
                    clean =negativeCheck[0];
                }               
            }             
            if(!angular.isUndefined(decimalCheck[1])) {
                decimalCheck[1] = decimalCheck[1].slice(0,2);
                clean =decimalCheck[0] + '.' + decimalCheck[1];
            }
            if (val !== clean) {
              ngModelCtrl.$setViewValue(clean);
              ngModelCtrl.$render();
            }
            return clean;
          });
          element.bind('keypress', function(event) {
            if(event.keyCode === 32) {
              event.preventDefault();
            }
          });
        }
    };
});


app.directive('autoTabTo', [function () {
  return {
      restrict: "A",
      link: function (scope, el, attrs) {
          el.bind('keyup', function(e) {
            if (this.value.length === this.maxLength) {
              var element = document.getElementById(attrs.autoTabTo);
              if (element)
                element.focus();
            }
          });
      }
  }
}]);

app.directive('compareTo', function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
             
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
});

 
app.directive('onErrorSrc', function() {
  return {
      link: function(scope, element, attrs) {
        element.bind('error', function() {
          if (attrs.src != attrs.onErrorSrc) {
            attrs.$set('src', attrs.onErrorSrc);
          }
        });
      }
  }
});

app.directive('preventCopyPaste', function(){
  return {
    scope: {},
    link:function(scope,element){
      element.on('cut copy paste contextmenu', function (event) {
        event.preventDefault();
      })
    }
  };
});
app.directive('fileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var id = attrs.id;
      
      element.bind('change', function(){
         /*scope.$apply(function(){*/
          console.log(id);
          if(id == 'coverPhoto'){
            scope.Data.coverPhoto = element[0].files[0];
          }else{
            scope.addPhoto = true;
          }
          if(id == 'coverPhoto1'){

            scope.Data.coverPhoto1 = element[0].files[0];
          }
          if(id == 'coverPhoto2'){
            scope.Data.coverPhoto2 = element[0].files[0];
          }
          if(id == 'coverPhoto3'){
            scope.Data.coverPhoto3 = element[0].files[0];
          }
          if(id == 'coverPhoto4'){
            scope.Data.coverPhoto4 = element[0].files[0];
          }
          if(id == 'coverPhoto5'){
            scope.Data.coverPhoto5 = element[0].files[0];
          }
          console.log(scope.Data)
         });
      /*});*/
    }
  };
}]);
app.directive('fileModel1', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel1);
      var id = attrs.id;
      
      element.bind('change', function(){
         /*scope.$apply(function(){*/
          console.log(id);
          if(id == 'coverEditPhoto'){
            scope.details.coverEditPhoto = element[0].files[0];
          }else{
            scope.addPhoto = true;
          }
          if(id == 'coverEditPhoto1'){

            scope.details.coverEditPhoto1 = element[0].files[0];
          }
          if(id == 'coverEditPhoto2'){
            scope.details.coverEditPhoto2 = element[0].files[0];
          }
          if(id == 'coverEditPhoto3'){
            scope.details.coverEditPhoto3 = element[0].files[0];
          }
          if(id == 'coverEditPhoto4'){
            scope.details.coverEditPhoto4 = element[0].files[0];
          }
          if(id == 'coverEditPhoto5'){
            scope.details.coverEditPhoto5 = element[0].files[0];
          }
          console.log(scope.details)
         });
      /*});*/
    }
  };
}]);


app.directive('tagInput', function() {
    return {
      //restrict: 'E',
      scope: {
        inputTags: '=taglist',
        autocomplete: '=autocomplete'
      },
      link: function($scope, element, attrs) {
        $scope.defaultWidth = 200;
        $scope.tagText = '';
        $scope.placeholder = attrs.placeholder;
        if ($scope.autocomplete) {
          $scope.autocompleteFocus = function(event, ui) {
            $(element).find('input').val(ui.item.value);
            return false;
          };
          $scope.autocompleteSelect = function(event, ui) {
            $scope.$apply(`tagText='${ui.item.value}'`);
            $scope.$apply('addTag()');
            return false;
          };
          $(element).find('input').autocomplete({
            minLength: 0,
            source: function(request, response) {
              var item;
              return response((function() {
                var i, len, ref, results;
                ref = $scope.autocomplete;
                results = [];
                for (i = 0, len = ref.length; i < len; i++) {if (window.CP.shouldStopExecution(1)){break;}if (window.CP.shouldStopExecution(1)){break;}
                  item = ref[i];
                  if (item.toLowerCase().indexOf(request.term.toLowerCase()) !== -1) {
                    results.push(item);
                  }
                }
window.CP.exitedLoop(1);

window.CP.exitedLoop(1);

                return results;
              })());
            },
            focus: (event, ui) => {
              return $scope.autocompleteFocus(event, ui);
            },
            select: (event, ui) => {
              return $scope.autocompleteSelect(event, ui);
            }
          });
        }
        $scope.tagArray = function() {
          if ($scope.inputTags === undefined) {
            return [];
          }

          return $scope.inputTags.split(',').filter(function(tag) {
            return tag !== "";
          });
        };
        $scope.addTag = function() {
          var tagArray;
          if ($scope.tagText.length === 0) {
            return;
          }
          tagArray = $scope.tagArray();
          console.log(tagArray);
          console.log($scope.tagText);
          tagArray.push($scope.tagText);
          $scope.inputTags = tagArray.join(',');
          return $scope.tagText = "";
        };
        $scope.deleteTag = function(key) {
          var tagArray;
          tagArray = $scope.tagArray();
          if (tagArray.length > 0 && $scope.tagText.length === 0 && key === undefined) {
            tagArray.pop();
          } else {
            if (key !== undefined) {
              tagArray.splice(key, 1);
            }
          }
          return $scope.inputTags = tagArray.join(',');
        };
        
        // Watch for changes in text field
        $scope.$watch('tagText', function(newVal, oldVal) {
          var tempEl;
          if (!(newVal === oldVal && newVal === undefined)) {
            tempEl = $("<span>" + newVal + "</span>").appendTo("body");
            $scope.inputWidth = tempEl.width() + 5;
            if ($scope.inputWidth < $scope.defaultWidth) {
              $scope.inputWidth = $scope.defaultWidth;
            }
            return tempEl.remove();
          }
        });
        element.bind("keydown", function(e) {
          var key;
          key = e.which;
          if (key === 9 || key === 13) {
            e.preventDefault();
          }
          if (key === 8) {
            return $scope.$apply('deleteTag()');
          }
        });
        return element.bind("keyup", function(e) {
          var key;
          key = e.which;
          
          // Tab, Enter or , pressed 
          if (key === 9 || key === 13 || key === 188) {
            e.preventDefault();
            return $scope.$apply('addTag()');
          }
        });
      },
      template: "<div class='tag-input-ctn'><div class='input-tag' data-ng-repeat=\"tag in tagArray() track by $index \">{{tag}}<div class='delete-tag' data-ng-click='deleteTag($index)'>&times;</div></div><input type='text' data-ng-style='{width: inputWidth}' data-ng-model='tagText' placeholder='{{placeholder}}'/></div>"
    };
  });
app.directive("fileinput", [function() {

  return {
    scope: {
      fileinput: "=",
      filepreview: "=",
      filepreview1: "=",
      filepreview2: "=",
      filepreview3: "=",
      filepreview4: "=",
      filepreview5: "=",
    },
    link: function(scope, element, attributes) {
      element.bind("change", function(changeEvent) {
        console.log(scope.fileinput);
        scope.fileinput = changeEvent.target.files[0];
        var reader = new FileReader();
        reader.onload = function(loadEvent) {
          scope.$apply(function() {
            if(attributes.id == 'coverPhoto'){
              scope.filepreview = loadEvent.target.result;
            }
            if(attributes.id == 'coverPhoto1'){
              scope.filepreview1 = loadEvent.target.result;
            }
            if(attributes.id == 'coverPhoto2'){
              scope.filepreview2 = loadEvent.target.result;
            }
            if(attributes.id == 'coverPhoto3'){
              scope.filepreview3 = loadEvent.target.result;
            }
            if(attributes.id == 'coverPhoto4'){
              scope.filepreview4 = loadEvent.target.result;
            }
            if(attributes.id == 'coverPhoto5'){
              scope.filepreview5 = loadEvent.target.result;
            }
          });
        }
        reader.readAsDataURL(scope.fileinput);
      });
    }
  }
}]);
app.directive("fileinput1", [function() {

  return {
    scope: {
      fileinput1: "=",
      filepreview: "=",
      filepreview1: "=",
      filepreview2: "=",
      filepreview3: "=",
      filepreview4: "=",
      filepreview5: "=",
    },
    link: function(scope, element, attributes) {
      element.bind("change", function(changeEvent) {
        console.log(scope.fileinput1);
        scope.fileinput1 = changeEvent.target.files[0];
        var reader = new FileReader();
        reader.onload = function(loadEvent) {
          scope.$apply(function() {
            if(attributes.id == 'coverEditPhoto'){
              scope.filepreview = loadEvent.target.result;
            }
            if(attributes.id == 'coverEditPhoto1'){
              scope.filepreview1 = loadEvent.target.result;
            }
            if(attributes.id == 'coverEditPhoto2'){
              scope.filepreview2 = loadEvent.target.result;
            }
            if(attributes.id == 'coverEditPhoto3'){
              scope.filepreview3 = loadEvent.target.result;
            }
            if(attributes.id == 'coverEditPhoto4'){
              scope.filepreview4 = loadEvent.target.result;
            }
            if(attributes.id == 'coverEditPhoto5'){
              scope.filepreview5 = loadEvent.target.result;
            }
          });
        }
        reader.readAsDataURL(scope.fileinput1);
      });
    }
  }
}]);

app.directive('validFile',function(){
    return {
        require:'ngModel',
        link:function(scope,el,attrs,ctrl){
            ctrl.$setValidity('validFile', el.val() != '');
            //change event is fired when file is selected
            el.bind('change',function(){
                ctrl.$setValidity('validFile', el.val() != '');
                scope.$apply(function(){
                    ctrl.$setViewValue(el.val());
                    ctrl.$render();
                });
            });
        }
    }
});
app.directive('slickSlider',function($timeout){
 return {
   restrict: 'A',
   link: function(scope,element,attrs) {
     $timeout(function() {
         $(element).slick(scope.$eval(attrs.slickSlider));
     });
   }
 }
}); 
