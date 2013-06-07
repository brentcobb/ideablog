angular.module('App').controller('DashboardCtrl', function($scope, $http, $location, $_, $routeParams, $markdown) {
  
//////////////    Retriever   /////////////////////////////////////////////////
//
//    This function gets articles stored in couchdb posted by logged in user
///////////////////////////////////////////////////////////////////////////////

  $http.get('/api/article').success(function(data) {
    $scope.articles = $_(data.rows).pluck('value');
  });

//////////////    TrashChecker    /////////////////////////////////////////////
//
//    This is used in a filter to check each article in the ng-repeat
//    it checks each article for the field '_deleted:false' in the json.
//    If the article does not have said field it is removed from view.  T
//    his is used to avoid refreshing the page to see articles be removed.
///////////////////////////////////////////////////////////////////////////////

  $scope.trashCheck = function(article) {
    return !article.hasOwnProperty('_deleted');
  };

//////////////    Logout function   ///////////////////////////////////////////
//
//    This function logs the user out.  Will turn into factory to reduce 
//    duplicate code at a later date, as I want to have a logout button in
//    more than one place.
///////////////////////////////////////////////////////////////////////////////

  $scope.logout = function() {
    $http.post('/api/logout').success(function(data) {
     //alerts.push({type: 'success', msg: 'Successfully logged out.'});
      $location.path('/');
    });
  };

//////////////    Username Retrieval    ///////////////////////////////////////
//
//    This function deternimes the currently logged in user.  
///////////////////////////////////////////////////////////////////////////////

  $http.get('/api/session').success(function(data) {
    $scope.user = data.user;
  });

//////////////    Hide Articles   /////////////////////////////////////////////
//
//    The hidePost works, after clicking the button you must refresh the page
//    for the hiding to work.  
///////////////////////////////////////////////////////////////////////////////
  
  $scope.hidePost = function(article) {
    article._deleted = true;
      $http.post('/api/article', article);
  };

});
