//
// app.js
//

angular.module('MyWayApp', ['ui.bootstrap', 'angularFileUpload']);

var DirCreateModalCtrl = function($scope, $modal, $log, $http, $upload) {

  $scope.open = function() {
    var modalInstance = $modal.open({
      templateUrl: 'dirCreateContent.html',
      controller: DirCreateModalInstanceCtrl,
      resolve: {
      }
    });

    modalInstance.result.then(
      function(dir_name) {
        $scope.pwd = path;
        $scope.input_dir_name = dir_name;
        $http({
          url: '/create_dir',
          method: 'POST',
          data: "dir_name=" + $scope.input_dir_name + "&pwd=" + $scope.pwd,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        }).
        success(function(data, status, headers, config) {
          $log.info("post success at: " + new Date());
          $scope.$parent.files = [];
          for (var i in data) {
            $scope.$parent.files.push({
              name: data[i].basename,
              mime_type: data[i].mime_type,
              modified: data[i].modified,
              file_path: data[i].file_path
            });
          }
        }).
        error(function(data, status, headers, config) {
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


var UploadModalCtrl = function($scope, $modal, $log, $http, $upload, $location) {
  $scope.open = function() {
    var modalInstance = $modal.open({
      templateUrl: 'uploadContent.html',
      controller: UploadModalInstanceCtrl,
      resolve: {
      }
    });

    modalInstance.result.then(
      function() {
        $http({
          method: 'GET',
          url: $location.absUrl(),
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          }
        }).success(function(data, status, headers, config) {
          $scope.$parent.files = [];
          for (var i in data) {
            $scope.$parent.files.push({
              name: data[i].basename,
              mime_type: data[i].mime_type,
              modified: data[i].modified,
              file_path: data[i].file_path
            });
          }
          console.log("success!");
        }).error(function(data, status, headers, config) {
          console.log("error!");
        });
      }
    );
  };
};

var UploadModalInstanceCtrl = function($scope, $modalInstance) {
  $scope.close = function() {
    $modalInstance.close();
  };
};


var UploadCtrl = function($scope, $upload, $location) {
  $scope.path = path;
  $scope.message = "";

  $scope.onFileSelect = function($files) {
    for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      $scope.upload = $upload.upload({
        url: '/upload',
        method: 'POST',
        data: { path: $scope.path },
        file: file
      }).progress(function(evt) {
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
        console.log('file uploaded!');
        $scope.message = "ファイルアップロード完了しました。";

        // console.log($scope.$parent.$parent.files);
        // $scope.$parent.$parent.files = [];
        // for (var i in data) {
        //   $scope.$parent.$parent.push({
        //     name: data[i].basename,
        //     mime_type: data[i].mime_type,
        //     modified: data[i].modified,
        //     file_path: data[i].file_path
        //   });
        // }

      }).error(function(data, status, headers, config) {
        console.log('upload filed');
        $scope.message = "ファイルアップロード失敗しました。";
      });
    }
  };
};
