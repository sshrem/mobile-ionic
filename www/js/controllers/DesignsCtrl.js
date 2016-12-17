angular.module('DisignStudio')
  .controller('DesignsCtrl', function ($rootScope, $scope, Cloudinary, $ionicScrollDelegate, $cordovaSocialSharing, $window, designsService, backendService, $stateParams) {

    var designsRequestUrl = 'http://' + $rootScope.domain + '/api/mobile/designs';

    $scope.totalNumOfDesigns;
    $scope.bedroomItems;
    $scope.title;
    $scope.designs;
    $scope.projectName = $stateParams.projectName;
    $scope.projectId = $stateParams.projectId;
    $scope.aptTmplId = $stateParams.aptId;

    $scope.playVideo = function (title, designId, imgCode) {
      var imagingUrl = Cloudinary.url(imgCode, {
        resource_type: 'video',
        format: 'mp4',
        height: $rootScope.height,
        width: $rootScope.width
      });
      $window.plugins.streamingMedia.playVideo(imagingUrl);
      $scope.registerEvent("PlayVideo", {
        "design": title,
        "project": $scope.projectId,
        "apartment": $scope.aptTmplId
      });

      var stats = {
        projectId: $scope.projectId,
        apartmentTemplateId: $scope.aptTmplId,
        designId: designId
      };

      $scope.recordStats("recordImagingView", stats);
    }

    $scope.share = function (designId, designTitle, url) {

      var shareMessage = designTitle + ", " + $scope.title + ", " + $scope.projectName;
      $cordovaSocialSharing
        .share(shareMessage, null, null, url)
        .then(function (result) {
          $scope.recordUserActionStats(designId, 2);
          $scope.registerEvent("share");
        }, function (err) {

        });
    }

    function init() {

      var itemFilters = [];
      designsService.getSelectedFilters().forEach(function (entry) {
        itemFilters.push({
          room: entry.room,
          offer: entry.offer
        })
      });

      var supplierFilter = null;
      if (designsService.isSupplierSelected(0) == false) { // Supplier not selected
        supplierFilter = {
          supplier: designsService.getSelectedSupplier()
        }
      }

      var reqData = {
        atId: $scope.aptTmplId,
        projId: $scope.projectId,
        itemFilters: itemFilters,
        supplierFilter: supplierFilter
      }

      backendService.postRequest(designsRequestUrl, reqData,
        function (data) {
          if (data) {
            $scope.designs = data.designs;
            $scope.title = data.title;
            $scope.totalNumOfDesigns = data.totalNumOfDesigns;

            if ($scope.designs!= null && $scope.designs.length>0){
              $scope.playVideo(designs[0].title,design.ids[0],design.imagings[0])
            }
          }
        },
        'designs_' + $scope.projectId + '_' + $scope.aptTmplId
      )
    }

    $scope.recordViewSuppliers = function (designId) {
      $scope.registerEvent("viewSuppliers");
      $scope.recordUserActionStats(designId, 1);
    }

    $scope.recordUserActionStats = function (designId, action) {
      var stats = {
        projectId: $scope.projectId,
        apartmentTemplateId: $scope.aptTmplId,
        designId: designId,
        action: action
      };

      $scope.recordStats("recordUserAction", stats);
    }

    init();
  })
