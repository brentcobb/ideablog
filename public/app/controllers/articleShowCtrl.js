angular.module('App').controller('ArticleShowCtrl', function($scope, $http, $routeParams, $location, $_) {

  $http.get('/api/article').success(function(data) {
    $scope.articles = $_(data.rows).pluck('value');
  });

  

});