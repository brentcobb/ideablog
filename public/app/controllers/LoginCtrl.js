angular.module('App').controller('LoginCtrl', function($scope, $http, $location, authService, dialog) {
  
  $scope.login = function(user) {
    $http.post('/api/login', user)
      .success(function(user) {
        dialog.close();
        //alerts.push({type: 'success', msg: 'Successfully logged in.'});
        authService.loginConfirmed();
      })
      .error(function(err) {
        // alert error
      });
    $location.path('/dashboard');
  };
});