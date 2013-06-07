angular.module('App').controller('HomeCtrl', function($scope, $routeParams, $http, $markdown, $_, alerts, $location) {
  
/*  $scope.user = $routeParams.user;
  $http.get('/api/article/' + $routeParams.user + '/all')
    .success(function(data) {
      $scope.articles = $_(data.rows).pluck('value');
    });*/

  $scope.mode = 'New';
  $http.get('/api/session').success(function(data) {
    $scope.user = data.user;
  });

  $http.get('/api/article').success(function(data) {
    $scope.articles = $_(data.rows).pluck('value');
  });


//////////////    Logout function   ///////////////////////////////////////////
//
//    This function logs the user out.  Will turn into factory to reduce 
//    duplicate code at a later date, as I want to have a logout button in
//    more than one place.
///////////////////////////////////////////////////////////////////////////////

  $scope.logout = function() {
    $http.post('/api/logout').success(function(data) {
      alerts.push({type: 'success', msg: 'Successfully logged out.'});
      $location.path('/');
    });
  };


});