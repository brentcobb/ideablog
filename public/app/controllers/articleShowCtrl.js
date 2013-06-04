angular.module('App').controller('ArticleShowCtrl', function($scope, $http, $routeParams, $location, $_) {

  $http.get('/api/article/' + article._id).success(function(data) {
    $scope.article = $_(data.rows).pluck('value');
  });

  

});