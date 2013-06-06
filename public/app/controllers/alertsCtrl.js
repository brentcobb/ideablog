angular.module('App').controller('alertsCtrl', function($scope, $http, $_) {
   
  $scope.alert = {};

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
});