angular.module('App').controller('AlertsCtrl', function($scope, $alerts) {

$scope.alerts = [];

   $scope.addAlert = function() {
    $scope.alerts.push({msg: "Another alert!"});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

});