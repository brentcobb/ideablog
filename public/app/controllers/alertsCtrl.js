angular.module('App').controller('alertsCtrl', function($scope, $alerts) {
   

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
});