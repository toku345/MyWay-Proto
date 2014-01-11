//
// app.js
//

angular.module('MyWayApp', ['ui.bootstrap']);

var DirCreateModalCtrl = function($scope, $modal, $log, $http) {

  $scope.open = function() {
    var modalInstance = $modal.open({
      templateUrl: 'dirCreateContent.html',
      controller: DirCreateModalInstanceCtrl,
      resolve: {
      }
    });

    modalInstance.result.then(
      function(dir_name) {
        $scope.input_dir_name = dir_name;
        $http({
          url: '/create_dir',
          method: 'POST',
          data: "dir_name=" + $scope.input_dir_name + "&pwd=" + $scope.pwd,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        }).success(function(data, status, headers, config) {
          $log.info("post success at: " + new Date());
        }).error(function(data, status, headers, config) {
          $log.info("post error at: " + new Date());
        });
      },
      function() {
        $log.info('DirCreateModal dismissed at: ' + new Date());
      }
    );
  };
};

var DirCreateModalInstanceCtrl = function($scope, $modalInstance) {
  $scope.input = {
    dir_name: ""
  };

  $scope.ok = function() {
    $modalInstance.close($scope.input.dir_name);
  };
  $scope.cancel = function() {
    $modalInstance.dismiss("cancel");
  };
};
