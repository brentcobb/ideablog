angular.module('App').controller('DashboardCtrl', function($scope, $http, $location, $_, $routeParams) {
  
//////////////    Retriever   /////////////////////////////////////////////////
//
//    This function gets articles stored in couchdb posted by logged in user
///////////////////////////////////////////////////////////////////////////////

  $http.get('/api/article').success(function(data) {
    $scope.articles = $_(data.rows).pluck('value');
  });



//////////////    Logout function   ///////////////////////////////////////////
//
//    This function logs the user out.  Will turn into factory to reduce 
//    duplicate code at a later date, as I want to have a logout button in
//    more than one place.
///////////////////////////////////////////////////////////////////////////////

  $scope.logout = function() {
    $http.post('/api/logout').success(function(data) {
      alerts.push({type: 'success', msg: 'Successfully logged out.'});
      $location.path('/');
    });
  };

//////////////    Username Retrieval    ///////////////////////////////////////
//
//    This function deternimes the currently logged in user.  
///////////////////////////////////////////////////////////////////////////////


  $scope.mode = 'New';
  $http.get('/api/session').success(function(data) {
    $scope.user = data.user;
  });

//////////////    test area   /////////////////////////////////////////////////
//
//    Working on a function to delete posts.  I think i have it set up correct.
//    I just need to make the articles show correctly so that they can be 
//    deleted.
///////////////////////////////////////////////////////////////////////////////
  




  $scope.removePost = function(article_rev){
  
    $http.delete("/article/" + article_rev);
  };

});
