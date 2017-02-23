'use strict';

angular.module('starter.controllers', ['angular.filter','ngSanitize','angular-md5'])

.controller('LoginController',['$scope', '$rootScope', '$location', 'AuthenticationService','$state',
    function ($scope, $rootScope, $location, AuthenticationService ,$state) {
        // reset login status
        AuthenticationService.ClearCredentials();
 
        $scope.login = function () {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, function(response) {
                if(response.success) {
                    AuthenticationService.SetCredentials($scope.username, $scope.password);
                    // $state.go('subject');
                    $location.path('/subject');
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });
        };
    }])
/*
*
*/
.controller('loginCtrl', function($scope,$rootScope, $timeout, $ionicPopup, $http, $state,md5) {

       $scope.signIn = function(){
        $http.post('http://161.246.14.72/api/check_login.php',
            {"username":$scope.username,"password": md5.createHash($scope.password)},{
              headers : {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
              }
            }).success(function(data){
          if (data.StatusID == 10) {
                $rootScope.sMemberID = data.MemberID;
                $scope.getUser();
                console.log('fail' +  data);
          }else{
            console.log('fail');
            $scope.showAlertFail();
            // $state.go('tab.dash');
          }
        });
        }
    

    $scope.gotoRegis1 = function(){
          $state.go('regis1');
        }


    $rootScope.userPro = {};
    $scope.getUser = function() {
            var request = $http({
            method: "post",
            url: "http://161.246.14.72/api/getMemberID.php",
            data: {
                sMemberID: $rootScope.sMemberID
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
         request.success(function(res) {
            $rootScope.userPro = res;
            $scope.checkRole();
            console.log('User Profile ', $rootScope.userPro);
        });
    }

     $scope.checkRole = function(){
            if($rootScope.userPro.groups == "1"){
              $scope.showAlertTeacher();
           }else if($rootScope.userPro.status == "0"){
              $scope.showAlertNotActive();
           }else if($rootScope.userPro.status == "1"){
              $scope.showAlertSuccess();
           }else if($rootScope.userPro.status == "-1"){
              $scope.showAlertBlocked();
           }
      }

    $scope.showAlertFail = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Login Fail!',
            template: 'Invalid Username and Password '
        });
    };

    $scope.showAlertSuccess = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Login Success!',
            template: 'Welcome Back: "' + $scope.username + '"'

        });
        $state.go('subject'); 
    };

    $scope.showAlertBlocked = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Blocked!',
            template: 'Your account has been blocked!'
        });
    };

    $scope.showAlertNotActive = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Not active!',
            template: 'Your account dont active, please contact to your admin or teacher'
        });
    };
    $scope.showAlertTeacher = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Fail!',
            template: 'Teacher cant sign in here!'
        });
    };
})
/*
*
*/
.controller('subCtrl', function($scope,$rootScope, $ionicPopup, $state,$http) {
      
          $scope.$on('$ionicView.loaded', function(event) {
          console.log('enter subCtrl get subject list');
            var req = {
              method: 'GET',
              dataType:"jsonp",
              url: 'http://161.246.14.72/studeponse/index.php/api/subject',
              data: null,
              headers : {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
              }
            };


            $http(req).
            success(function(response)
              {

              $scope.names = response;
              console.log('get subject');
               // $scope.setSubject();
          });

          var request = {
              method: 'GET',
              dataType:"jsonp",
              url: 'http://161.246.14.72/studeponse/index.php/api/usersubject',
              data: null,
              headers : {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
              }
            };


            $http(request).
            success(function(response)
              {

              $scope.usersubject = response;
              console.log('get subject');
               // $scope.setSubject();
          });

      });


      $scope.setSubject = function(mySelect) {
        console.log(mySelect);
        $rootScope.sub = mySelect;        
      };
  

        $scope.data = {}
        $scope.showPopup = function() {
          var alertPopup = $ionicPopup.alert({
            title: 'Success!',
            template: 'imformation have been saved'
          });
          alertPopup.then(function(res) {
            console.log('imformation have been saved');
            $state.go('tab.dash');
          });
        };


     /* เพิ่มวิชา
     -----------------------------------------------------------------*/
      $rootScope.sub = {};
      $scope.addsub = function() {
        var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="sub.codeclass">',
        title: 'Enter Code class',
        subTitle: 'get the code by your teacher',
        scope: $rootScope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Join !</b>',
            type: 'button-positive',
            onTap: function(e) {
              if ($rootScope.sub.codeclass.length == 0) {
                  console.log("preventing default");
                  console.log($rootScope.sub.codeclass);
                  e.preventDefault();
                } else {
                  $scope.checkSub();
                }
            }
          }
        ]
      });
      }

      $scope.checkSub = function(){
          $http.post('http://161.246.14.72/api/check_alreadyExistsSubject.php',
                {"subject_id":$rootScope.sub.codeclass,"user_id": $rootScope.userPro.id },{
                  headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                  }
                }).success(function(data){
              if (data.Error == 10) {
                  $scope.alreadyHave();
                  console.log('fail' +  data);

              }else{
                  $scope.postSubject();
              }
            });
        }

        $scope.alreadyHave = function(){
          var alertPopup = $ionicPopup.alert({
              title: 'Fail! <i class="ion-alert-circled"></i>',
              template: 'คุณลงทะเบียนวิชานี้ไปเรียบร้อยแล้ว'
              
            });
          alertPopup.then(function(res) {

            });

        }

        $scope.postSubject = function(){
        var newSub = { 
          user_id:  $rootScope.userPro.id,
          subject_id: $rootScope.sub.codeclass
          
        };
          Object.toparams = function ObjecttoParams(obj) 
          {
            var p = [];
            for (var key in obj) 
            {
              p.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return p.join('&');
          };

              var req = 
              {
                  method: 'POST',
                  url: "http://161.246.14.72/studeponse/index.php/api/usersubject",
                  data: Object.toparams(newSub),
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              }
              $http(req).
              success(function(data) 
              {
                  console.log(data);
                   $scope.showPopupSubSuccess();
                  $state.go('subject');
              }).
              error(function(data) 
              {
                  //error
              });
    }

        $scope.showPopupSubSuccess = function(){
          var alertPopup = $ionicPopup.alert({
              title: 'success! <i class="ion-alert-circled"></i>',
              template: 'ขอร้องเข้าชั้นเรียนสำเร็จ'
              
            });
          alertPopup.then(function(res) {
              console.log('ขอร้องเข้าชั้นเรียนสำเร็จ');

            });

        }

})
/*
*
*
*/
.controller('regisCtrl', function($scope,$rootScope, $ionicPopup,$ionicActionSheet,$state,$http,md5) {
  /* Regis username and password
  --------------------------------------------------*/
    $scope.getError = function() {
                var request = $http({
                method: "post",
                url: "http://161.246.14.72/api/check_alreadyExists.php",
                data: {
                    username: $scope.username,
                    email: $scope.email
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
             request.success(function(res) {
              if (res.Error == 10) {
                $scope.showErrorUser();
                console.log('User Profile ', $scope.userError );
              }else{
                $scope.submit_regis1();
              }
            });
    }

    $scope.showErrorUser = function() {
                      var alertPopup = $ionicPopup.alert({
                          title: 'Fail!',
                          template: 'This username or email already exist!'
                      });
    }

    $scope.submit_regis1 = function () {
        // $scope.checkdata = {};
        $rootScope.regis1 ={};
        var regis = { 
            username: $scope.username,
            password: md5.createHash($scope.password), 
            email:$scope.email,
            status: '0',
            superuser: '0' };
          Object.toparams = function ObjecttoParams(obj) 
          {
            var p = [];
            for (var key in obj) 
            {
              p.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return p.join('&');
          };

              var req = 
              {
                  method: 'POST',
                  url: "http://161.246.14.72/studeponse/index.php/api/users",
                  data: Object.toparams(regis),
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              }

              $http(req).
              success(function(data, status, headers, config) 
              {
                  console.log(data);
                  $rootScope.regis1 = data;
                  $state.go('regis2');
                  

              }).
              error(function(data, status, headers, config) 
              {
                  //error
              });
      }


      /* Firstname Lastname
      --------------------------------------------------*/
      $rootScope.idfromRegis1 = {};
        $scope.getIDtoRegis2 = function() {
                var request = $http({
                method: "post",
                url: "http://161.246.14.72/api/getIDtoRegis2.php",
                data: {
                    username: $rootScope.regis1.username
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
             request.success(function(res) {
                 $rootScope.idfromRegis1 = res;
                 $scope.submit_regis2();
            });
        }

       $scope.submit_regis2 = function () {
          var regisprofile = { 
            user_id: $rootScope.idfromRegis1.id,
            firstname: $scope.firstname,
            lastname: $scope.lastname, 
             };
          Object.toparams = function ObjecttoParams(obj) 
          {
            var p = [];
            for (var key in obj) 
            {
              p.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return p.join('&');
          };

              var reqprofile = 
              {
                  method: 'POST',
                  url: "http://161.246.14.72/studeponse/index.php/api/profile",
                  data: Object.toparams(regisprofile),
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              }

              $http(reqprofile).
              success(function(data, status, headers, config) 
              {
                  console.log(data);
                  $scope.popupSuccessRegis();
                  $state.go('login');
              }).
              error(function(data, status, headers, config) 
              {
                  //error
              });
        }

        $scope.popupSuccessRegis = function() {
            var alertPopup = $ionicPopup.alert({
                title: 'Success!',
                template: 'Your account has been saved!'
            });
        };

  
  
      $scope.showActionsheet = function(){
        $ionicActionSheet.show({
          titleText: 'Do you want to leave?',
          destructiveText: 'Leave',
          cancelText: 'Cancel',

          cancel: function(){
            console.log('CANCELLED')

          },
          destructiveButtonClicked: function() {
            $state.go('login');
          }

        });
      };

      $scope.data = {}
      $scope.showPopup = function() {
        var alertPopup = $ionicPopup.alert({
          title: 'Success!',
          template: 'imformation have been saved'
        });
        alertPopup.then(function(res) {
          console.log('imformation have been saved');
          $state.go('tab.dash');
        });
      };
})
/*
*
*/
.controller('DashCtrl', function($scope,$rootScope) {})
/*
*
*/
.controller('quizCtrl', function($scope, Quizs,$http,$rootScope) {
    // $scope.hideItem = function(){

    // }

  // $scope.$on('$destroy', function() {
  //     $scope.modal.remove();
  // });

    console.log('quiz Ctrl entrie');
     /* GET quiz title
      -------------------------------------------------------------*/
        $scope.$on('$ionicView.loaded', function(event) {
            console.log('quizCtrl');
            var req = {
              method: 'GET',
              dataType:"jsonp",
              url: 'http://161.246.14.72/studeponse/index.php/api/poll',
              data: null,
              headers : {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
              }
            };

            $http(req).
            success(function(response)
            {
             $rootScope.quizs = response;
              console.log('success get q');
            });
        });

        $scope.$on('$ionicView.loaded', function(event) {
            console.log('quizCtrl');
            var req = {
              method: 'GET',
              dataType:"jsonp",
              url: 'http://161.246.14.72/studeponse/index.php/api/questions',
              data: null,
              headers : {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
              }
            };

            $http(req).
            success(function(response)
            {
             $rootScope.essay = response;
              console.log('success get q essay');
            });
        });


    $scope.refreshQuiz = function() {
      console.log("Refreshing items!");
        var req = {
              method: 'GET',
              dataType:"jsonp",
              url: 'http://161.246.14.72/studeponse/index.php/api/poll',
              data: null,
              headers : {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
              }
            };

            $http(req).
            success(function(response)
            {
             $rootScope.quizs = response;
              console.log('success get q');
            });
        $scope.$broadcast('scroll.refreshComplete');
    };


       


})
/*
*
*/
.controller('quizdetailCtrl', function($scope, $rootScope,$stateParams, $ionicPopup, $timeout,$state,$http) {
  $scope.$on('$ionicView.loaded', function(event) {
     $scope.$on('$destroy', function() {
         $rootScope.hideTabs = $scope.modal;
      });
   });
     /* GET choice
        ------------------------------------------------------------*/
            $rootScope.quizsChoice = [];
            console.log('quizDetailCtrl');
            var req = {
              method: 'GET',
              dataType:"jsonp",
              url: 'http://161.246.14.72/studeponse/index.php/api/pollchoice',
              data: null,
              headers : {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
              }
            };

            $http(req).
            success(function(response)
            {
             $rootScope.quizsChoice = response;
              console.log('success get q detail');
            });
      
      /*GET Essay detail
      _______________________________________________________________*/
      $scope.$on('$ionicView.loaded', function(event) {
            console.log('quizCtrl');
            var req = {
              method: 'GET',
              dataType:"jsonp",
              url: 'http://161.246.14.72/studeponse/index.php/api/questions',
              data: null,
              headers : {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
              }
            };

            $http(req).
            success(function(response)
            {
             $rootScope.essay = response;
              console.log('success get q essay');
            });
        });

      /*Essay param
      -----------------------------------------------------------*/
     $scope.$on("$ionicView.loaded", function(event) {
      $scope.e = $scope.doGetEssay($stateParams.eid);
       console.log($stateParams.eid);
    });

    $scope.doGetEssay = function(eid) {
        for (var i = 0; i< $rootScope.essay.length; i++) {
            if ($rootScope.essay[i].question_id === eid) {
              console.log($rootScope.essay[i].question_id);
                return $rootScope.essay[i];
            }
        }
    }
     
    /* Multiple param
    -----------------------------------------------------*/
    $scope.$on("$ionicView.loaded", function(event) {
      $scope.q = $scope.doGetData($stateParams.qid);
      // $scope.qd = $rootScope.quizsChoice;
       console.log($stateParams.qid);
    });

    $scope.doGetData = function(qid) {
        for (var i = 0; i< $rootScope.quizs.length; i++) {
            if ($rootScope.quizs[i].id === qid) {
              console.log($rootScope.quizs[i].id);
                return $rootScope.quizs[i];
            }
        }
    }

    /*Multiple post ans
    -------------------------------------------------------*/
    $scope.checkAns = function(){
      $http.post('http://161.246.14.72/api/check_alreadyExistsAns.php',
            {"poll_id":$scope.q.id,"user_id": $rootScope.userPro.id },{
              headers : {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
              }
            }).success(function(data){
          if (data.Error == 10) {
                $scope.alreadyAns();
                console.log('fail' +  data);
          }else{
            $scope.postans();
          }
        });
    }

    $scope.alreadyAns = function(){
      var alertPopup = $ionicPopup.alert({
          title: 'Fail! <i class="ion-alert-circled"></i>',
          template: 'คุณตอบข้อนี้ไปแล้ว! ห้ามส่งคำตอบซ้ำ : this item is already exist! can"t send it again'
          
        });
      alertPopup.then(function(res) {
          console.log($scope.answer);
          $state.go('tab.takequiz');
        });

    }


    $scope.setchoiceNumber = function(index) {
        console.log(index);
        $scope.answer = index;        
      }

    $scope.postans = function(){
      console.log( $rootScope.userPro.id);

        var answer = { 
          user_id:  $rootScope.sMemberID,
          choice_id: $scope.answer,
          poll_id: $scope.q.id
          
        };
          Object.toparams = function ObjecttoParams(obj) 
          {
            var p = [];
            for (var key in obj) 
            {
              p.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return p.join('&');
          };

              var req = 
              {
                  method: 'POST',
                  url: "http://161.246.14.72/studeponse/index.php/api/pollvote",
                  data: Object.toparams(answer),
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              }
              $http(req).
              success(function(data, status, headers, config) 
              {
                  console.log(data);
                   $scope.confirmSendAns();
                  $state.go('tab.takequiz');
              }).
              error(function(data, status, headers, config) 
              {
                  //error
              });
    }

   $scope.showPopup = function() {
     $scope.data = {}

     $timeout(function() {
        myPopup.close(); //close the popup after 3 seconds for some reason
     }, 3000);
    };

    $scope.confirmSendAns = function() {
      var alertPopup = $ionicPopup.alert({
          title: 'Success <i class="ion-checkmark-circled"></i>',
          template: 'ส่งคำตอบเรียบร้อย : your answer already sent'

        });
      alertPopup.then(function(res) {
          console.log($scope.answer);
          $state.go('tab.takequiz');
        });

    }

    /*Essay post ans
    -------------------------------------------------------*/
    $scope.checkEssay = function(){
      $http.post('http://161.246.14.72/api/check_alreadyExistsEssay.php',
            {"question_id":$scope.e.question_id,"user_id": $rootScope.userPro.id },{
              headers : {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
              }
            }).success(function(data){
          if (data.Error == 10) {
                $scope.alreadyAns();
                console.log('fail' +  data);
          }else{
            $scope.postEssay();
          }
        });
    }

    $scope.alreadyAns = function(){
      var alertPopup = $ionicPopup.alert({
          title: 'Fail! <i class="ion-alert-circled"></i>',
          template: 'คุณตอบข้อนี้ไปแล้ว! ห้ามส่งคำตอบซ้ำ : this item is already exist! can"t send it again'
        });
      alertPopup.then(function(res) {
          console.log('already ans! cannot send again');
          $state.go('tab.takequiz');
        });

    }


    // $scope.setchoiceNumber = function(index) {
    //     console.log(index);
    //     $scope.answer = index;        
    //   }

    $scope.postEssay = function(){
      console.log( $rootScope.userPro.id);

        var answer = { 
          user_id:  $rootScope.sMemberID,
          essay: $scope.ans_essay,
          question_id: $scope.e.question_id
          
        };
          Object.toparams = function ObjecttoParams(obj) 
          {
            var p = [];
            for (var key in obj) 
            {
              p.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return p.join('&');
          };

              var req = 
              {
                  method: 'POST',
                  url: "http://161.246.14.72/studeponse/index.php/api/essayvote",
                  data: Object.toparams(answer),
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              }
              $http(req).
              success(function(data, status, headers, config) 
              {
                  console.log(data);
                   $scope.confirmSendAns();
                  $state.go('tab.takequiz');
              }).
              error(function(data, status, headers, config) 
              {
                  //error
              });
    }

   $scope.showPopup = function() {
     $scope.data = {}

     $timeout(function() {
        myPopup.close(); //close the popup after 3 seconds for some reason
     }, 3000);
    };

    $scope.confirmSendAns = function() {
      var alertPopup = $ionicPopup.alert({
          title: 'Success <i class="ion-checkmark-circled"></i>',
          template: 'ส่งคำตอบเรียบร้อย : your answer already sent'
          
        });
      alertPopup.then(function(res) {
          console.log($scope.answer);
          $state.go('tab.takequiz');
        });

    }

    /*-----------------------------------------------------------------*/

})
/*
*
*/
.controller('progressCtrl', function($scope,$rootScope, $stateParams,$http) {
  $scope.$on('$ionicView.loaded', function(event) {
          /* GET pollvote table
          --------------------------------------------------------*/
            var req = {
              method: 'GET',
              dataType:"jsonp",
              url: 'http://161.246.14.72/studeponse/index.php/api/pollvote',
              data: null,
              headers : {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
              }
            };

            $http(req).
            success(function(response)
            {
             $rootScope.quizAns = response;
              console.log('get pollvote' + $rootScope.quizAns);
            });

            /* GET pollchoice table
          --------------------------------------------------------*/
            var reqe = {
              method: 'GET',
              dataType:"jsonp",
              url: 'http://161.246.14.72/studeponse/index.php/api/pollchoice',
              data: null,
              headers : {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
              }
            };

            $http(reqe).
            success(function(response)
            {
             $rootScope.showAns = response;
              console.log('get pollvote' + $rootScope.showAns);
            });      


            /* GET Essay
          --------------------------------------------------------*/
            var reqe = {
              method: 'GET',
              dataType:"jsonp",
              url: 'http://161.246.14.72/studeponse/index.php/api/essayvote',
              data: null,
              headers : {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
              }
            };

            $http(reqe).
            success(function(response)
            {
             $rootScope.showEssay = response;
              console.log('get pollvote' + $rootScope.showAns);
            });



  });



  $scope.refreshAns = function() {
      console.log("Refreshing items!");
        $http.get('http://161.246.14.72/studeponse/index.php/api/pollvote')
          .success(function(newItems) {
              $scope.board = newItems;
       })

        $http.get('http://161.246.14.72/studeponse/index.php/api/pollchoice')
          .success(function(newment) {
              $scope.comments = newment;
       })
      $scope.$broadcast('scroll.refreshComplete');
    };
})

/*
*
*/
.controller('boardCtrl', function($scope,$rootScope, $ionicPopup, $state,$http,$cordovaDatePicker,$ionicHistory,$sanitize,$ionicScrollDelegate,$timeout) {
  $scope.$on('$ionicView.loaded', function(event) {
    console.log('boardCtrl');

      /*GET Post
      ----------------------------------------------------*/
      var req = {
        method: 'GET',
        dataType:"jsonp",
        url: 'http://161.246.14.72/studeponse/index.php/api/posts',
        data: null,
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      };

      $http(req).
      success(function(response)
      {
          $scope.board = response;
          console.log('success');
      }).
      error(function()
      {
          //error
      })

         console.log('complete');
  });




      /*GET Comment
      ----------------------------------------------------*/
       $scope.$on('$ionicView.loaded', function(event) {
          console.log('boardCtrl');
      // $scope.items = [];
      var reqment = {
        method: 'GET',
        dataType:"jsonp",
        url: 'http://161.246.14.72/studeponse/index.php/api/comments',
        data: null,
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      };

      $http(reqment).
      success(function(response)
      {
      $scope.comments = response;
      // $scope.items = response.content;
      console.log('success');
       // console.log('success'+ $scope.items);
      });
         console.log('complete');
        });

       /*collaps code
       ---------------------------------------------*/
       $scope.toggleGroup = function(group) {
          if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
          } else {
            $scope.shownGroup = group;
          }
        };
        $scope.isGroupShown = function(group) {
          return $scope.shownGroup === group;
        };

  /*Send comment
  ---------------------------------------------*/
  $scope.check = function() {
    $scope.checkBlank= angular.copy($scope.content_comment);
    if( $scope.checkBlank.length == 0) {
        
        $scope.err_ment = 'cannot be blank';
        console.log('blank comment');

    }else{
      $scope.submit_comment();
    }
  }

  $scope.submit_comment = function () {
        var newment = { 
            author: $rootScope.userPro.username, 
            content:$scope.content_comment, 
            post_id: $scope.key.id ,
            status: '2'};        
          Object.toparams = function ObjecttoParams(obj) 
          {
            var p = [];
            for (var key in obj) 
            {
              p.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return p.join('&');
          };

              var req = 
              {
                  method: 'POST',
                  url: "http://161.246.14.72/studeponse/index.php/api/comments",
                  data: Object.toparams(newment),
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              }

              $http(req).
              success(function(data) 
              {
                  $scope.content_comment = "";
                  $scope.refreshItems();
                  $state.go($state.current, {}, {reload: true});
                  console.log(data);
                  
              }).
              error(function(data) 
              {
                  // $scope.err = data;
              });   
    }

  /*New Post
  ---------------------------------------------*/
  $scope.newpost = function() {
    $state.go('tab.newpost');
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
  };

  $scope.checkNewPost = function() {
    $scope.checkBlanktitle = angular.copy($scope.post_title);
    $scope.checkBlankContent = angular.copy($scope.post_content);
    $scope.checkBlankTag = angular.copy($scope.post_tag);

    if( $scope.checkBlanktitle.length == 0 &&
        $scope.checkBlankContent.length == 0 &&
        $scope.checkBlankTag.length == 0) {
        
        $scope.err_ment = 'cannot be blank';
        console.log('blank comment');

    }else{
      $scope.submit_comment();
    }
  }

  $scope.sendPost = function() {
    $scope.refreshItems();
    $scope.submit_newpost();
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
  }
  $scope.submit_newpost = function () { 
        var newpost = { 
            author_id: $rootScope.sMemberID,
            title:$scope.post_title, 
            content:$scope.post_content,
            // create_time: moment().format("dddd,MM,YYYY h:mm:ss a"),
            create_time: new Date().getTimezoneOffset(),
            tags: $scope.post_tag, 
            status: '2' };
          Object.toparams = function ObjecttoParams(obj) 
          {
            var p = [];
            for (var key in obj) 
            {
              p.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return p.join('&');
          };
              var req = 
              {
                  method: 'POST',
                  url: "http://161.246.14.72/studeponse/index.php/api/posts",
                  data: Object.toparams(newpost),
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              }

              $http(req).
              success(function(data, status, headers, config) 
              {
                  console.log(data);
                  $state.go('tab.webboard');
              }).
              error(function(data, status, headers, config) 
              {
                  //error
              }); 


    }
    /* Delete Comment
    ---------------------------------------------------*/
    $scope.goBackdeletement = function() {
        $scope.myVar = !$scope.myVar;
        $scope.removement();
    }

    $scope.removement = function() {
      console.log($scope.ment.id);
      var ments = {
        id: $scope.ment.id

      };
          Object.toparams = function ObjecttoParams(obj) 
          {
            var p = [];
            for (var key in obj) 
            {
              p.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return p.join('&');
          };
      var req = 
              {
                  method: 'DELETE',
                  url:"http://161.246.14.72/studeponse/index.php/api/comments/"+ parseInt($scope.ment.id),
                  data: Object.toparams(ments),
                  // headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              }
            $http(req).
                    success(function(data) 
                    {
                        $scope.alertmentdelete();
                        $scope.refreshItems();
                        console.log(data);
                    }).
                    error(function(data) 
                    {
                      
                    });
  }

   $scope.alertmentdelete = function() {
      var alertPopup = $ionicPopup.alert({
          title: 'Delete comment',
          template: 'commment has been Delete'
        });
      alertPopup.then(function(res) {
          console.log('remove commment');
        });
    }

   /* Delete Post
    ---------------------------------------------------*/    
    $scope.goBackdeletePost = function() {
        $scope.myModel = !$scope.myModel;
        $scope.removepost();
    }



    $scope.removepost = function() {
      console.log($scope.key.id);
      var posts = {id: $scope.key.id};
          Object.toparams = function ObjecttoParams(obj) 
          {
            var p = [];
            for (var key in obj) 
            {
              p.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return p.join('&');
          };
      var req = 
              {
                  method: 'DELETE',
                  url:"http://161.246.14.72/studeponse/index.php/api/posts/"+ $scope.key.id,
                  data: Object.toparams(posts),
              }
            $http(req).
                    success(function(data, status, headers, config) 
                    {
                        $scope.refreshItems();
                        $state.go($state.current, {}, {reload: true});
                        $scope.alertpostdelete();
                        console.log(data);
                    }).
                    error(function(data, status, headers, config) 
                    {

                    });
    }

    $scope.alertpostdelete = function() {
      var alertPopup = $ionicPopup.alert({
          title: 'Delete post',
          template: 'your post has been Delete'
        });
      alertPopup.then(function(res) {
         
 
          console.log('remove post');
        });
    }

    /* Refresh
    ---------------------------------------------------------------*/
     $scope.refreshItems = function() {
      $state.go($state.current, {}, {reload: true});
      console.log("Refreshing webboard!");
        $http.get('http://161.246.14.72/studeponse/index.php/api/posts')
          .success(function(newItems) {
              $scope.board = newItems;
       })

        $http.get('http://161.246.14.72/studeponse/index.php/api/comments')
          .success(function(newment) {
              $scope.comments = newment;
       })
      $scope.$broadcast('scroll.refreshComplete');
    };

})
/*
*
*/
.controller('AccountCtrl', function($scope,$rootScope, $ionicActionSheet,$state,$ionicPopup,$ionicHistory,$http,md5) {
  $scope.change ={};
  $scope.updatePass = function() {
          var req = 
              {
                  method: 'POST',
                  url:"http://161.246.14.72/api/updatePassword.php",
                  data: {
                    id: $scope.userPro.id,
                    password: md5.createHash($scope.change.password)
                  },
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              }
            $http(req).
                    success(function(data) 
                    {
                        if(data.StatusID == 1){
                          $scope.showPopup();
                          console.log(data);
                        }
                    }).
                    error(function(data) 
                    {

                    });
  }

  $scope.change ={};
   $scope.updateMail = function() {
          var req = 
              {
                  method: 'POST',
                  url:"http://161.246.14.72/api/updateEmail.php",
                  data: {
                    id: $scope.userPro.id,
                    email: $scope.change.email
                  },
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              }
            $http(req).
                    success(function(data) 
                    {
                        if(data.StatusID == 1){
                          $scope.showPopup();
                          console.log(data);
                        }
                    }).
                    error(function(data) 
                    {

                    });
  }

  $scope.updateFirstname = function() {
     var upfirst = {
      user_id: $scope.userPro.id,
      firstname: $scope.change.firstname
    };
          Object.toparams = function ObjecttoParams(obj) 
          {
            var p = [];
            for (var key in obj) 
            {
              p.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return p.join('&');
          };
    var req = 
              {
                  method: 'PUT',
                  url:"http://161.246.14.72/studeponse/index.php/api/profile/" + $rootScope.userPro.id,
                  // url:"http://8b62a7a3.ngrok.io/api/updateFirstname.php",
                  data: Object.toparams(upfirst),
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              }
            $http(req).
                    success(function(data) 
                    {
                        
                          $scope.showPopup();
                          console.log(data);
                        
                    }).
                    error(function(data) 
                    {

                    });
  }

  $scope.updateLastname = function() {
    var upLast = {
      user_id: $rootScope.userPro.id,
      lastname: $scope.change.lastname
    };
          Object.toparams = function ObjecttoParams(obj) 
          {
            var p = [];
            for (var key in obj) 
            {
              p.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return p.join('&');
          };
     var req = 
              {
                  method: 'PUT',
                  url:"http://161.246.14.72/studeponse/index.php/api/profile/" + $rootScope.userPro.id,
                  data: Object.toparams(upLast),
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              }
            $http(req).
                    success(function(data) 
                    {
                       
                          $scope.showPopup();
                          console.log(data);
                       
                    }).
                    error(function(data) 
                    {

                    });
  }
  
  $scope.showPopup = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Success!',
      template: 'imformation have been saved'
    });
    alertPopup.then(function(res) {
      console.log('imformation have been saved');
      $scope.clearHistory();
      $scope.refreshAccount();
      $state.go('tab.dash');
    });
  }

  $scope.refreshAccount = function() {
      console.log("Refreshing items!");
        var request = $http({
            method: "post",
            url: "http://161.246.14.72/api/getMemberID.php",
            data: {
                sMemberID: $rootScope.sMemberID
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
         request.success(function(res) {
            $rootScope.userPro = res;
            $scope.checkRole();
            console.log('User Profile ', $rootScope.userPro);
        });
        $scope.$broadcast('scroll.refreshComplete');
    };

  // $scope.changeSub = function(){
  //   $ionicActionSheet.show({
  //     titleText: 'Do you want to change subject?',
  //     destructiveText: '<i class="ion-arrow-swap"></i> Yes',
  //     cancelText: 'Cancel',

  //     cancel: function(){
  //       console.log('CANCELLED')

  //     },
  //     destructiveButtonClicked: function() {
  //       $scope.changeSubject();
  //       console.log('pass clearHistory');
  //     }
  //   });
  // }

  //  $scope.changeSubject = function() {
  //   $ionicHistory.clearCache();
  //   $ionicHistory.clearHistory();
  //   $state.go('subject');
  //   console.log('change Subject');
  //   };





  $scope.logout = function(){
    $ionicActionSheet.show({
      titleText: 'Do you want to exist?',
      destructiveText: '<i class="ion-log-out"></i> logout',
      cancelText: 'Cancel',

      cancel: function(){
        console.log('CANCELLED')

      },
      destructiveButtonClicked: function() {
        $scope.clearHistory();
        console.log('pass clearHistory');
      }
    });
  }

  $scope.clearHistory = function() {
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    $state.go('login');
    console.log('log out');
    };
})
/*
*
*/
.controller('CameraCtrl', function($scope,$rootScope, $cordovaCamera){

    $scope.pictureUrl = 'http://placehold.it/300x300';
    $scope.takePicture = function(){
    var options = {
      destinationType: Camera.DestinationType.DATA_URL,
      encodingType: Camera.EncodingType.JPEG,
      saveToPhotoAlbum: false
    }
    $cordovaCamera.getPicture(options)
    .then(function(data){
      console.log('camera data: ' + angular.toJson(data));
      $scope.pictureUrl = 'data:image/jpeg;base64,' + data;
    }, function(error){
      console.log('camera error: ' + angular.toJson(data));
    });
  };

    $scope.choosePicture = function(){

      var options = {
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: Camera.EncodingType.JPEG,
        saveToPhotoAlbum: false
      }

      $cordovaCamera.getPicture(options)
    .then(function(data){
      console.log('camera data: ' + angular.toJson(data));
      $scope.pictureUrl = 'data:image/jpeg;base64,' + data;
    }, function(error){
      console.log('camera error: ' + angular.toJson(data));
    });
    };
});