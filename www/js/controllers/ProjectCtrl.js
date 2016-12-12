// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('DisignStudio')
  .constant('Project_Tabs', {
    ABOUT: 1,
    APARTMENT: 2,
    FEATURES: 3
  })
  .controller('ProjectCtrl', function ($rootScope, Cloudinary, $ionicScrollDelegate, $scope, $state, backendService, Project_Tabs, $ionicModal) {

    $scope.availableTabs = Project_Tabs;
    $scope.tabToDisplay = Project_Tabs.ABOUT;
    $scope.projectId = 3;
    $scope.project;
    $scope.companyAboutModal;

    var initRequestUrl = 'http://' + $rootScope.domain + '/api/mobile/project';

    var updateBackgroundImage = function () {
      $scope.backgroundImage = Cloudinary.url($scope.project.image, {
        crop: 'scale',
        format: 'jpg',
        quality: '80',
        width: $rootScope.width
      });
    }

    $scope.changeTab = function (tab, metricName) {
      $ionicScrollDelegate.scrollTop();
      $scope.tabToDisplay = tab;
      $scope.registerEvent(metricName, {
        "project": $scope.projectCode
      });
    }

    $ionicModal.fromTemplateUrl('company-about-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.companyAboutModal = modal
    })


    $scope.showCompanyAbout = function () {
      $scope.companyAboutModal.show();
      $scope.registerEvent("ViewCompanyAbout", {
        "project": $scope.projectCode
      });
    }

    $scope.closeCompanyAbout = function (id) {
      $scope.companyAboutModal.hide();
    }

    $scope.$on('$destroy', function () {
      $scope.companyAboutModal.remove();
    });


    function init() {

      backendService.postRequest(initRequestUrl, {
        projId: $scope.projectId
      }, function (data) {
        if (data) {
          $scope.project = data;
          updateBackgroundImage();
        }
      }, 'project_' + $scope.projectId);
    };

    init();
  })
