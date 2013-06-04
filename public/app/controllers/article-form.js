angular.module('App').controller('ArticleNewCtrl', function($scope, $location, $http,  $moment, $routeParams) {
  
  $scope.article = {};


//////////////    Saver   /////////////////////////////////////////////////////
//
//    This function saves the article.  Not sure if this should be in the 
//    dashboard ctrl.  I added it to the article-form.js and it worked great.
//    I am going to comment it out for the time being.  
///////////////////////////////////////////////////////////////////////////////

  $scope.save = function(article) {
    article.type = 'article';
    article.slug = article.title.toLowerCase().replace(' ', '-');
    $http.post('/api/article', article)
      .success(function(article) {
      $location.path('/dashboard');
      alerts.push({type: 'success', msg: 'Successfully added article!'});
    })
    .error(function(err) {
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