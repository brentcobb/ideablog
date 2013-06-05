angular.module('App').controller('ArticleNewCtrl', 
  function($scope, $location, $http,  $moment, $routeParams) {
  
  $scope.article = {};

  $scope.mode = 'New';
  $http.get('/api/session').success(function(data) {
    $scope.article.author = data.user;
  });

//////////////    Saver   /////////////////////////////////////////////////////
//
//    This function saves the article. I added it to the article-form.js and it worked great.
//    I am going to comment it out for the time being.  
///////////////////////////////////////////////////////////////////////////////

  $scope.save = function(article) {
    article.type = 'article';
    article._deleted = false;
    article.slug = article.title.toLowerCase().replace(' ', '-');
    article.tags = article.tags.toUpperCase();
    $http.post('/api/article', article)
      .success(function(article) {
      $location.path('/dashboard');
      //alerts.push({type: 'success', msg: 'Successfully added article!'});
    })
    .error(function(err) {
    //alerts.push({type: 'error', msg: 'Error: ' + err.error +'!'});
    });
  };


  $scope.cancel = function() {
    $location.path('/dashboard');
  };

//////////////    Username Retrieval    ///////////////////////////////////////
//
//    This function deternimes the currently logged in user.  
///////////////////////////////////////////////////////////////////////////////


  $scope.mode = 'New';
  $http.get('/api/session').success(function(data) {
    $scope.user = data.user;
  });


  $scope.article.attachment = function(article_rev) {
    $http.post('/api/article/attachment/'+ article_rev);
  };

 /* $scope.$watch('article.title', function(){
    console.log($scope.article.title);
  });

   $scope.$watch('article.body', function(){
    console.log($scope.article.body);
  });
*/

});