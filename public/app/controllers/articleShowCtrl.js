angular.module('App').controller('ArticleShowCtrl', function($scope, $http, $routeParams, $location, $_) {


  $scope.showArticle = function (article_id) {

  $http.get('/api/article/' + article_id).success(function(data) {
    $scope.article = $_(data.rows).pluck('value');
  });

  };

});