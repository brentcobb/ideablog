angular.module('App').controller('ArticleShowCtrl', function($scope, $http, $routeParams, $location, $_) {

 $http.get('/api/article/' + $routeParams.id)
    .success(function(article) {
      $scope.article = article;
    })
    .error(function(err) {
      $location.path('/dashboard');
  });

  $scope.showArticle = function (article_id) {

  $http.get('/api/article/' + article_id).success(function(data) {
    $scope.article = $_(data.rows).pluck('value');
  });

  };

});