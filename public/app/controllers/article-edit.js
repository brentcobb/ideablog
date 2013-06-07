angular.module('App').controller('ArticleEditCtrl', function($scope, $http, $routeParams, $location) {
  $scope.mode = 'Edit';

  // get article to edit
  $http.get('/api/article/' + $routeParams.id)
    .success(function(article) {
      $scope.article = article;
    })
    .error(function(err) {
      $location.path('/dashboard');
  });

  $scope.save = function(article) {
    article.tags = article.tags.toUpperCase();
    $http.put('/api/article/' + $routeParams.id, article)
      .success(function(article) {
        $location.path('/dashboard');
      })
      .error(function(err) {
        // alert err

      });
  };

  $scope.cancel = function() {
    $location.path('/dashboard');
  };

});