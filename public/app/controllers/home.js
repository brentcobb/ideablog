angular.module('App').controller('HomeCtrl', function($scope, $routeParams, $http, $markdown, $_) {
  
/*  $scope.user = $routeParams.user;
  $http.get('/api/article/' + $routeParams.user + '/all')
    .success(function(data) {
      $scope.articles = $_(data.rows).pluck('value');
    });*/

 /* $scope.mode = 'New';*/
  $http.get('/api/session').success(function(data) {
    $scope.user = data.user;
  });

  $http.get('/api/article').success(function(data) {
    $scope.articles = $_(data.rows).pluck('value');
  });

});