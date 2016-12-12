angular.module('DisignStudio')

  .factory('cacheService', function () {

    var cacheService = {};


    cacheService.saveToCache = function (key, data, expirationDate) {
      var obj = {
        expirationDate: expirationDate,
        data: data
      }
      window.localStorage[key] = JSON.stringify(obj);
    }

    cacheService.loadFromCache = function (key, callback) {

      var data = JSON.parse(window.localStorage[key] || null);
      if (data != null && !isCacheExpired(data.expirationDate)) {
        callback(data.data);
      } else {
        callback(null);
      }
    }

    var isCacheExpired = function (expirationDate) {

      // We are not using expiration - So it can never be expired... DUH!
      if (expirationDate == null){
        return false;
      }

      var now = new Date();
      var exp = new Date(expirationDate);
      return now.getTime() >= exp.getTime();
    }

    return cacheService;
  });
