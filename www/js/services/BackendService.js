angular.module('DisignStudio')

  .factory('backendService', function ($http, cacheService, $ionicLoading) {

    var backendService = {};

    backendService.postRequest = function (requestUrl, params, successFN, cacheKey) {

      $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner></ion-spinner>'
      });

      var cachedData;
      var config = {};
      cacheService.loadFromCache(cacheKey, function (data) {
        cachedData = data;
        config.timeout = (data == null) ? 5000 : 1500;
      });

      $http.post(requestUrl, params, config)
        .success(function (res) {
          onSuccess(res, cacheKey, successFN);
        })
        .error(function (e) {
          onError(e, cachedData, successFN);
        })
        .finally(function () {
          $ionicLoading.hide();
        });
    }

    var onSuccess = function (res, cacheKey, successFN) {
      cacheService.saveToCache(cacheKey, res.data, null);
      successFN(res.data);
    }

    var onError = function (e, cachedData, successFN) {
      successFN(cachedData);
    }

    return backendService;
  });
