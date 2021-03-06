angular.module('App').controller('LoginCtrl', function($scope, $http, $location, authService, dialog, $alerts) {
  
  $scope.login = function(user) {
    $http.post('/api/login', user)
      .success(function(user) {
        dialog.close();
        authService.loginConfirmed();
      })
      .error(function(err) {
        // alert error
      });
    $location.path('/dashboard');
    $alerts.push({type: 'success', msg: 'Successfully logged in.'});
  };

   $scope.cancel = function() {
    dialog.close();
  };

});