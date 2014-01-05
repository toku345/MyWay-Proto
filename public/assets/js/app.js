//
// app.js
//

angular.module('MyWayApp', ['ui.bootstrap', 'angularFileUpload']);

var ModalDemoCtrl = function($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];
  $scope.items2 = ['item21', 'item22', 'item23'];

  $scope.open = function() {
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl,
      resolve: {
        items: function() {
          return $scope.items;
        },
        items2: function() {
          return $scope.items2;
        }
        // items2: $scope.items2
      }
    });

    modalInstance.result.then(
      // function() {
      //   $log.info('hoge');
      // },
      function(selectedItem) {
        $scope.selected_ = selectedItem;
      },
      function() {
        $log.info('Modal dismissed at: ' + new Date());
      }
    );
  };
};

var ModalInstanceCtrl = function($scope, $modalInstance, items, items2) {

  $scope.items = items2;
  $scope.selected = {
    item: $scope.items[0]
  };


  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  }

  $scope.ok = function() {
    $modalInstance.close($scope.selected.item);
  }
};


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
        $http.post('/upload', {dir_name: $scope.input_dir_name, pwd: $scope.pwd}).success(function() {
          $log.info("post sucess at: " + new Date());
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
