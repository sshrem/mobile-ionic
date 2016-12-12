angular.module('DisignStudio')
  .controller('SearchDesignsCtrl', function ($rootScope, $scope, backendService, designsService, $stateParams) {

    var initRequestUrl = 'http://' + $rootScope.domain + '/api/mobile/designsFilters';

    $scope.suppliers = [];
    $scope.roomItems = [];
    $scope.roomItemsToDisplay = [];
    $scope.title;
    $scope.projectName = $stateParams.projectName;
    $scope.projectId = $stateParams.projectId;
    $scope.aptTmplId = $stateParams.aptId;
    $scope.filters;

    $scope.toggleGroup = function (group) {
      group.show = !group.show;
    };

    $scope.isGroupShown = function (group) {
      return group.show;
    };

    $scope.isAnySupplierSelected = function () {
      return designsService.getSelectedSupplier() > 0;
    }

    $scope.isSupplierSelected = function (id) {
      return designsService.isSupplierSelected(id);
    }

    $scope.onSelectSupplier = function (id) {

      if (designsService.isSupplierSelected(id)) {
        designsService.selectSupplier(0);
        $scope.roomItemsToDisplay = _.cloneDeep($scope.roomItems);
      } else {
        designsService.selectSupplier(id);
        $scope.roomItemsToDisplay = _.cloneDeep($scope.roomItems);
        _.forEach($scope.roomItemsToDisplay, function (o) {
          _.remove(o.items, function (obj) {
            return obj.supplierId != designsService.getSelectedSupplier();
          });
          o.items = _.chunk(o.items, 2);
        })
      }

      $scope.roomItems.forEach(function (group) {
        group.show = false;
      })
    }

    $scope.onSelectItem = function (roomId, offeringId) {
      designsService.addOrRemoveFilter(roomId, offeringId);
    }

    $scope.isItemSelected = function (roomId, offeringId) {
      return designsService.isFilterExist(roomId, offeringId);
    }

    $scope.filterRoomItems = function (room) {

      var roomsToDisplay = [];
      if (designsService.isAnySupplierSelected() == false) {
        roomsToDisplay = _.chunk(room.items, 2);
      } else {
        roomsToDisplay = _.chunk(_.filter(room.items, function (o) {
          return o.supplierId == designsService.getSelectedSupplier();
        }), 2);
      }

      return roomsToDisplay;
    }

    function init() {
      
      var reqData = {
        projId: $scope.projectId,
        atId: $scope.aptTmplId
      };

      backendService.postRequest(initRequestUrl, reqData,
        function (data) {
          if (data) {
            $scope.suppliers = _.chunk(data.suppliers, 2);
            $scope.roomItems = data.roomItems;
            $scope.title = data.title;
          }
          $scope.filters = [];
        },
        'designsFilters_' + $scope.projectId + '_' + $scope.aptTmplId
      )
    }

    init();
  })
