angular.module('App').controller('ArticleShowCtrl', function($scope, $http, $routeParams, $location) {

//////////////    Username Retrieval    ///////////////////////////////////////
//
//    This function deternimes the currently logged in user.  This is used for
//    the navbar.
///////////////////////////////////////////////////////////////////////////////


  $scope.mode = 'New';
  $http.get('/api/session').success(function(data) {
    $scope.user = data.user;
  });

//////////////    Article Retriever   /////////////////////////////////////////
//
//    Makes a http get request to the db to pull out the article.  On success
//    it creates a function that is passed article, then sets scope.article to
//    article.  On failure it returns the user to the dashboard.
///////////////////////////////////////////////////////////////////////////////

 $http.get('/api/article/' + $routeParams.id)
    .success(function(article) {
      $scope.article = article;
    })
    .error(function(err) {
      $location.path('/dashboard');
  });



});