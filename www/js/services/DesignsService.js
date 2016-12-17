angular.module('DisignStudio')

  .factory('designsService', function () {

    var designsService = {};
    var filters = [];
    var supplier = 0;

    designsService.selectSupplier = function (supplierId) {
      supplier = supplierId;
    }

    designsService.isSupplierSelected = function (id) {
      return supplier == id;
    }

    designsService.addOrRemoveFilter = function (roomId, offeringId) {

      _.remove(filters, function(item){
        return item.room == roomId;
      }) ;
      filters.push({
        room: roomId,
        offer: offeringId
      })
    }

    designsService.isFilterExist = function (roomId, offeringId) {
      return _.findIndex(filters, {room: roomId, offer: offeringId}) != -1;
    }


    designsService.getSelectedSupplier = function () {
      return supplier;
    }

    designsService.getSelectedFilters = function () {
      return filters;
    }

    return designsService;
  });
