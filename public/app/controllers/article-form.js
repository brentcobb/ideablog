angular.module('App').controller('ArticleNewCtrl', 
  function($scope, $location, $http,  $moment, $routeParams) {
  
  $scope.article = {};

//////////////    Username Retrieval    ///////////////////////////////////////
//
//    This function deternimes the currently logged in user.  
///////////////////////////////////////////////////////////////////////////////

  $scope.mode = 'New';
  $http.get('/api/session').success(function(data) {
    $scope.user = data.user;
  });

//////////////    Saver   /////////////////////////////////////////////////////
//
//    This function saves the article. Alerts are currently not working  
///////////////////////////////////////////////////////////////////////////////

  $scope.save = function(article) {
    article.author = $scope.user;
    article.type = 'article';
    article.publishedAt = moment().format('MMMM Do YYYY, h:mm:ss a');
    article.slug = article.title.toLowerCase().replace(' ', '-');
    article.tags = article.tags.toUpperCase();
    $http.post('/api/article', article)
      .success(function(article) {
        window.alert('You have successfully uploaded your article!');
      //alerts.push({type: 'success', msg: 'Successfully added article!'});
      $location.path('/dashboard');
    })
    .error(function(err) {
      window.alert('I did not know you could break it this way.  Thanks for finding new bugs!');
    //alerts.push({type: 'error', msg: 'Error: ' + err.error +'!'});
    });
  };

  $scope.cancel = function() {
    $location.path('/dashboard');
  };

 /* $scope.$watch('article.title', function(){
    console.log($scope.article.title);
  });

   $scope.$watch('article.body', function(){
    console.log($scope.article.body);
  });
*/

});