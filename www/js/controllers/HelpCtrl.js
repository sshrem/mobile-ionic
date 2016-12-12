angular.module('DisignStudio')

  .controller('HelpCtrl', function ($rootScope, $scope, $window, $ionicLoading, $http, $stateParams, $ionicModal) {

    var baseAssetsRequestUrl = 'http://' + $rootScope.domain + '/assets/';
    $scope.helpContent;
    $scope.helpModal;


    $ionicModal.fromTemplateUrl('help-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.helpModal = modal
    })


    $scope.showHelpModal = function (page) {

      $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner></ion-spinner>'
      });

      var requestUrl = baseAssetsRequestUrl + page + '.html';
      $http.get(requestUrl).success(function (res) {
        $scope.helpContent = res;
        $scope.helpModal.show();
      }).error(function (e) {

      }).finally(function () {
        $ionicLoading.hide();
      });

    }

    $scope.closeHelpModal = function (id) {
      $scope.helpModal.hide();
    }
  })
