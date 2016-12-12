angular.module('DisignStudio')

  .factory('userService', function ($http, $rootScope, cacheService) {

    var registerLoginRequestUrl = 'http://' + $rootScope.domain + '/api/users/registerLogin';
    var loginObservers = [];
    var userService = {};

    userService.user = {};
    userService.noUser = {
      authResponse: null,
      userID: 0,
      name: "Sign in for personalized expirience",
      email: null,
      image: "img/no-profile.gif",
      isLoggedIn: false
    };

    //register an observer
    userService.registerLoginObserver = function (callback) {
      loginObservers.push(callback);
    };

    var notifyLoginObservers = function () {
      angular.forEach(loginObservers, function (callback) {
        callback();
      });
    };

    userService.storeUser = function (user_data) {

      if (user_data.userID != 0) {
        $http.post(registerLoginRequestUrl, {
          "email": user_data.email,
          "name": user_data.name,
          "loginMethod": 1
        }).success(function (res) {
          user_data.userInternalID = res.data;
          storeUser(user_data);
        }).error(function (e) {
        })
      } else {
        user_data.userInternalID = 0;
        storeUser(user_data);
      }
    };

    var storeUser = function (user_data) {
      cacheService.saveToCache('fb_account', user_data, null);
      userService.user = user_data;
      notifyLoginObservers();
    }

    userService.loadUser = function () {
      cacheService.loadFromCache('fb_account', function (data) {
        userService.user = (data == null) ? userService.noUser : data;
        notifyLoginObservers();
      });
    };

    userService.loadUser();
    return userService;
  });
