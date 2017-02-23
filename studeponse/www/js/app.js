// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
'use strict';


angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCookies','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})


.config(function($stateProvider, $urlRouterProvider,$httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
    // $httpProvider.defaults.transformRequest = [function(data)
    // {
    //     return angular.isObject(data) && String(data) !== '[object File]' ? jQuery.param(data) : data;
    // }];
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:
  // .state('login', {
  //   url: '/login',
  //       templateUrl: 'templates/login.html',
  //       controller: 'loginCtrl'
  // })
    .state('login',{
      url : '/login',
      controller: 'loginCtrl',
      templateUrl: 'templates/login.html',
      hideMenus: true

    })


  .state('subject', {
    url: '/subject',
        templateUrl: 'templates/subject.html',
        controller: 'subCtrl'
  })

  .state('regis1', {
    url: '/regis1',
        templateUrl: 'templates/regis1.html',
        controller: 'regisCtrl'
  })

  .state('regis2', {
    url: '/regis2',
        templateUrl: 'templates/regis2.html',
        controller: 'regisCtrl'
  })

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.takequiz', {
      url: '/takequiz',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tabdash-takequiz.html',
          controller: 'quizCtrl'
        }
      }
    })
  .state('tab.qessay', {
      url: '/takequiz/qessay/:eid',
        views: {
        'tab-dash': {
          templateUrl: 'templates/tabdash-qessay.html',
          controller: 'quizdetailCtrl'
       }
      }
    })
  .state('tab.qmultiple', {
      url: '/takequiz/qmultiple/:qid',
       views: {
        'tab-dash': {
          templateUrl: 'templates/tabdash-qmultiple.html',
          controller: 'quizdetailCtrl'
        }
      }
    })
  .state('tab.progess', {
      url: '/progress',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tabdash-progress.html',
          controller: 'progressCtrl'
          
        }
      }
    })

.state('tab.webboard', {
      url: '/webboard',
      views: {
        'tab-board': {
          templateUrl: 'templates/tab-webboard.html',
          controller: 'boardCtrl'
        }
      }
    })
.state('tab.newpost', {
      url: '/newpost',
      views: {
        'tab-board': {
          templateUrl: 'templates/tabboard-newpost.html',
          controller: 'boardCtrl'
        }
      }
    })
  
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});


