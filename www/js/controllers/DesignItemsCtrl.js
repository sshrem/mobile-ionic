angular.module('DisignStudio')

.filter('totalPriceFilter', function() {
  return function(groups) {
    var totalPrice = 0;
    if (groups != undefined) {
      for (i = 0; i < groups.length; i++) {
        if (groups[i].isSelected == true) {
          totalPrice = totalPrice + groups[i].price;
        }
      }
    }

    return totalPrice;
  };
})

.controller('DesignItemsCtrl', function($rootScope, $scope, $window, $http, $stateParams, $filter, $ionicModal) {

  var initRequestUrl = 'http://' + $rootScope.domain + '/api/mobile/designItems';
  $ionicModal.fromTemplateUrl('branches-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal
  })

  $scope.designName = $stateParams.designName;
  $scope.totalPrice = 0;
  $scope.items = {};
  $scope.branches;


  $scope.openBranches = function(id) {
      $http.get('http://192.168.0.103:8080/api/mobile/branches', {
        params: {
          id: id
        }
      }).success(function(res) {
        if (res.data) {
          $scope.branches = res.data;
          $scope.modal.show();
        }
      });
  }

  $scope.closeBranches = function(id) {
    $scope.modal.hide();
  }

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  function init() {

    $http.get(initRequestUrl, {
      params: {
        dId: $stateParams.designId
      }
    }).success(function(res) {
      if (res.data) {
        $scope.items = res.data;
      }
    }).finally(function () {

    });
  };

  init();
})
