angular.module('DisignStudio')

  .controller('SuppliersCtrl', function ($rootScope, $scope, $window, $http, $stateParams, backendService) {

    var initRequestUrl = 'http://' + $rootScope.domain + '/api/mobile/designSuppliers';
    $scope.suppliers = {}

    $scope.openSupplierPage = function (url, supplierId) {

      var stats = {
        supplierId: supplierId,
        projectId: $stateParams.projectId,
        apartmentTemplateId: $stateParams.aptTmpl,
        designId: $stateParams.designId,
      }
      $scope.recordStats('recordViewSupplier', stats);
      window.open(url, '_system', 'location=yes');
      return false;
    }

    function init() {

      backendService.postRequest(initRequestUrl, {
          dId: $stateParams.designId,
          atId: $stateParams.aptTmpl
        },
        function (data) {
          if (data) {
            $scope.suppliers = data.suppliers;
          }
        },
        'designSuppliers_' + $stateParams.aptTmpl + '_' + $stateParams.designId
      )
    };

    init();
  })
