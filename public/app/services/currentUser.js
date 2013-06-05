angular.module('App');

App.factory('CurrentUser', function() {
  $scope.mode = 'New';
  $http.get('/api/session').success(function(data) {
    $scope.article.author = data.user;
  });
})