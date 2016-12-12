// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('DisignStudio', ['ionic', 'tmh.dynamicLocale', 'cloudinary', 'ui.router', 'ngCordova', 'pascalprecht.translate'])

app.filter("trustUrl", ['$sce', function ($sce) {
  return function (url) {
    return $sce.trustAsResourceUrl(url);
  };
}])


app.config(function ($stateProvider, $ionicConfigProvider, $urlRouterProvider, $httpProvider, $translateProvider, CloudinaryProvider) {

    $httpProvider.defaults.useXDomain = true;

    CloudinaryProvider.configure({
      cloud_name: 'disignstudio',
      api_key: '671623578364648'
    });

    for (lang in appTranslations) {
      $translateProvider.translations(lang, appTranslations[lang]);
    }
    $translateProvider.preferredLanguage('he');

    $ionicConfigProvider.backButton.text('');
    $ionicConfigProvider.backButton.previousTitleText(false);
    $ionicConfigProvider.platform.android.scrolling.jsScrolling(false);
    $ionicConfigProvider.platform.ios.scrolling.jsScrolling(false);

    $urlRouterProvider.otherwise('/')

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html'
      })
      .state('project', {
        url: '/',
        templateUrl: 'templates/project.html'
      })
      .state('designs', {
        url: '/imaging/:projectId/:projectName/:aptId',
        templateUrl: 'templates/designs.html'
      })
      .state('searchDesigns', {
        url: '/searchdesigns/:projectId/:projectName/:aptId',
        templateUrl: 'templates/searchDesigns.html'
      })
      .state('designItems', {
        url: '/design/:designName/:designId/',
        templateUrl: 'templates/designItems.html'
      })
      .state('suppliers', {
        url: '/suppliers/:projectId/:aptTmpl/:designId',
        templateUrl: 'templates/suppliers.html'
      })
      .state('help', {
        url: '/help',
        templateUrl: 'templates/help.html'
      })
  })

  .run(function ($ionicPlatform, $rootScope, $window) {

    $rootScope.width = $window.innerWidth;
    $rootScope.height = $window.innerHeight;
    $rootScope.domain = "projects.disignstudio.com";
    //$rootScope.domain = "localhost:8080";

    $ionicPlatform.ready(function () {

      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

app.controller('AppController', function ($scope, $rootScope, $ionicLoading, $http, tmhDynamicLocale, $window, $cordovaInAppBrowser, $state, userService) {

  $scope.userName = "init";
  $scope.userPicture;
  $scope.isLoggedIn = true;
  var platform;
  var uuid;
  var platformVersion;
  var model;
  var osVersion;
  var recordStatsRequestUrl = 'http://' + $rootScope.domain + '/api/stats/';
  var scheme;
  var isWazeAvailable;
  var wazeMarketPlaceURL;

  tmhDynamicLocale.set('he-il');
  document.addEventListener("deviceready", onDeviceReady, false);

  function onDeviceReady() {

    platform = device.platform;
    uuid = device.uuid;
    platformVersion = device.platformVersion;
    model = device.model;
    osVersion = device.version;

    // Don't forget to add the org.apache.cordova.device plugin!
    if (platform === 'iOS') {
      scheme = 'waze://';
      wazeMarketPlaceURL = encodeURI("itms-apps://itunes.apple.com/app/apple-store/id323229106");
    } else if (platform === 'Android') {
      scheme = 'com.waze';
      wazeMarketPlaceURL = "https://play.google.com/store/apps/details?id=com.waze";
    }

    appAvailability.check(
      scheme, // URI Scheme
      function () { // Success callback
        isWazeAvailable = true;
      },
      function () { // Error callback
        isWazeAvailable = false;
      }
    );
  }

  // Mix Panel
  $scope.registerEvent = function (event, properties) {

    if (properties == null) {
      properties = {};
    }

    properties.uuid = uuid;
    properties.platformVersion = platformVersion;

    mixpanel.track(event, properties);
  }

  // Internal Stats for algo
  $scope.recordStats = function (reqName, reqData) {

    if (reqData == null) {
      reqData = {};
    }

    reqData.userId = userService.user.userInternalID;
    reqData.uuid = uuid;
    reqData.os = platform;
    reqData.deviceModel = model;
    reqData.osVersion = osVersion;

    var requestUrl = recordStatsRequestUrl + reqName;

    var input = JSON.stringify(reqData);
    $http.post(requestUrl, input);
  }

  $scope.sendFeedback = function () {
    var subject = "Feedback ( " + model + " / " + platform + " / " + osVersion + " )";
    var toRecipients = ["ohad@disignstudio.com"];
    window.plugins.emailComposer.showEmailComposerWithCallback(null, subject, null, toRecipients, null, null, null, null, null);
    $scope.registerEvent("Feedback");
  }

  $scope.openWaze = function (lon, lat, project, destination) {
    if (isWazeAvailable) {
      var wazeUrl = 'waze://?ll=' + lat + ',' + lon + '&navigate=yes';
      $window.open(wazeUrl, '_system', 'location=no');
    } else {
      try {
        $window.open(wazeMarketPlaceURL, '_system', 'location=no');
      } catch (e) {
        console.error("Failed to open waze store", e);
      }

    }
    $scope.registerEvent("Waze", {
      "project": project,
      "destination": destination
    });
  }

  var updateUser = function () {
    $scope.userName = userService.user.name;
    $scope.userPicture = userService.user.image;
    $scope.isLoggedIn = userService.user.isLoggedIn;
  }

  userService.registerLoginObserver(updateUser);

  updateUser();
});
