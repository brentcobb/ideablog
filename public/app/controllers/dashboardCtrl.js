angular.module('App').controller('DashboardCtrl', function($scope, $http, $location, $_) {
  
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
      //alerts.push({type: 'success', msg: 'Successfully logged out.'});
      $location.path('/');
    });
  };

//////////////    Username Retrieval    ///////////////////////////////////////
//
//    This function deternimes the currently logged in user.  
///////////////////////////////////////////////////////////////////////////////


  $scope.mode = 'New';
  $http.get('/api/session').success(function(data) {
    console.log(data);
    $scope.user = data.user;
  });

});
//////////////    Saver   /////////////////////////////////////////////////////
//
//    This function saves the article.  Not sure if this should be in the 
//    dashboard ctrl.  I added it to the article-new.js and it worked great.
//    I am going to comment it out for the time being.  
///////////////////////////////////////////////////////////////////////////////

  /*$scope.save = function(article) {
    article.type = 'article';
    article.slug = article.title.toLowerCase().replace(' ', '-'); 
    $http.post('/api/article', article)
      .success(function(article) {
        // alert success
      $location.path('/dashboard');
        //alerts.push({type: 'success', msg: 'Successfully added article!'});
    })
      .error(function(err) {
      // alert err
      //alerts.push({type: 'error', msg: 'Error: ' + err.error +'!'});
      });
  };

  $scope.cancel = function() {
    $location.path('/dashboard');
  };*/