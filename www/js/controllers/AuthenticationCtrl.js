angular.module('DisignStudio')

  .controller('AuthenticationCtrl', function ($scope, $state, $q, userService, $ionicLoading, $ionicActionSheet) {

    var fbLoginSuccess = function (response) {
      if (!response.authResponse) {
        fbLoginError("Cannot find the authResponse");
        return;
      }

      var authResponse = response.authResponse;

      getFacebookProfileInfo(authResponse)
        .then(function (profileInfo) {
          // For the purpose of this example I will store user data on local storage
          userService.storeUser({
            authResponse: authResponse,
            userID: profileInfo.id,
            name: profileInfo.name,
            email: profileInfo.email,
            image: "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large",
            isLoggedIn: true
          });
          $ionicLoading.hide();
        }, function (fail) {
          fbLoginError("Can't get profile info");
        });
    };

    // This is the fail callback from the login method
    var fbLoginError = function (error) {
      $ionicLoading.hide();
    };

    // This method is to get the user profile info from the facebook api
    var getFacebookProfileInfo = function (authResponse) {
      var info = $q.defer();

      facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
        function (response) {
          info.resolve(response);
        },
        function (response) {
          info.reject(response);
        }
      );
      return info.promise;
    };

    $scope.fbSignIn = function () {
      facebookConnectPlugin.getLoginStatus(function (success) {
        if (success.status === 'connected') {
          // Check if we have our user saved
          userService.loadUser();

          if (!userService.user.userID) {
            getFacebookProfileInfo(success.authResponse)
              .then(function (profileInfo) {
                userService.storeUser({
                  authResponse: success.authResponse,
                  userID: profileInfo.id,
                  name: profileInfo.name,
                  email: profileInfo.email,
                  image: "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large",
                  isLoggedIn: true
                });
              }, function (fail) {
                // Failed to get profile info
              });
          } else {
            // UserID not exists
          }
        } else {
          // If (success.status === 'not_authorized') the user is logged in to Facebook,
          // but has not authenticated your app
          // Else the person is not logged into Facebook,
          // so we're not sure if they are logged into this app or not.

          $ionicLoading.show({
            template: 'Logging in...'
          });

          // Ask the permissions you need. You can learn more about
          // FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
          facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
        }
      });
    };

    $scope.fbSignOut = function () {
      $ionicLoading.show({
        template: 'Logging Out...'
      });
      facebookConnectPlugin.logout(function () {
        },
        function (fail) {
        });

      userService.storeUser(userService.noUser);

      $ionicLoading.hide();
    };
  })
