angular.module('App', ['ui.bootstrap', 'ui.codemirror', 'http-auth-interceptor'])
  .config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', { 
        controller: 'SignupCtrl', 
        templateUrl: '/app/templates/signup.html'
      })
      .when('/login', {
        controller: 'LoginCtrl',
        templateUrl: '/app/templates/login.html'
      })
      .when('/dashboard', { 
        controller: 'DashboardCtrl', 
        templateUrl: '/app/templates/dashboard.html'
      })
      .when('/article', {
        controller: 'ArticleCtrl', 
        templateUrl: '/article.html'
      })
      .when('/article/new', { 
        controller: 'ArticleNewCtrl', 
        templateUrl: '/app/templates/article-form.html'
      })
      .when('/article/:id', { 
        controller: 'ArticleShowCtrl', 
        templateUrl: '/app/templates/article-show.html'
      })
      .when('/article/:id/edit', { 
        controller: 'ArticleEditCtrl', 
        templateUrl: '/app/templates/article-form.html'
      })
      .when('/:user', { 
        controller: 'HomeCtrl', 
        templateUrl: '/app/templates/home.html'
      })
      .when('/:user/:slug', { 
        controller: 'ArticleCtrl', 
        templateUrl: '/app/templates/article.html'
      })
      .otherwise({
        redirectTo: ('/')
      })
    ;
  });
angular.module('App').value('alerts', []);
angular.module('App').value('$markdown', markdown);
/*app.filter('mdImage', function() {
  return function(input) {
    if (input) {
      return ['![',input.name, '](/uploads/',input.path,')'].join('');
    }
  };
});
*/
angular.module('App').value('$moment', moment);
angular.module('App').value('$_', _);
angular.module('App').directive('uploadButton', function($parse, $compile) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<span class="upload-button {{class}}">' +
        '<span ng-transclude></span>' +
        '<input type="file">' +
      '</span>',
    link: function(scope, element, attrs) {
      element.find('input').bind('change', function() {
        var fd = new FormData();
        fd.append('uploadFile', this.files[0]);
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function(e) {
          var fn = $parse(attrs.complete);
          scope.$apply(function () {
            if(fn) { fn(scope, { $data: xhr.responseText, $status: xhr.status }); } 
          });
        }, false);
        xhr.open("POST", attrs.action);
        xhr.send(fd);
      });
    }
  };
});
angular.module('App').controller('LoginCtrl', function($scope, $http, $location, authService, dialog) {
  
  $scope.login = function(user) {
    $http.post('/api/login', user)
      .success(function(user) {
        dialog.close();
        //alerts.push({type: 'success', msg: 'Successfully logged in.'});
        authService.loginConfirmed();
      })
      .error(function(err) {
        // alert error
      });
    $location.path('/dashboard');
  };

   $scope.cancel = function() {
    dialog.close();
  };

});
angular.module('App').controller('alertCtrl', function($scope, $http, $location, $_, $routeParams) {

});
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
angular.module('App').controller('ArticleNewCtrl', 
  function($scope, $location, $http,  $moment, $routeParams) {
  
  $scope.article = {};

//////////////    Saver   /////////////////////////////////////////////////////
//
//    This function saves the article. I added it to the article-form.js and it worked great.
//    I am going to comment it out for the time being.  
///////////////////////////////////////////////////////////////////////////////

  $scope.save = function(article) {
    article.type = 'article';
    article._deleted = false;
    article.slug = article.title.toLowerCase().replace(' ', '-');
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
angular.module('App').controller('ArticleCtrl', function($scope, $http, $routeParams, $location) {  


  $http.get('/api/article/' + $routeParams.user + '/' + $routeParams.slug)
    .success(function(data) {
      $scope.article = data.rows[0].value;
      $scope.article.html = $markdown.toHTML($scope.article.body);
    });

});
angular.module('App').controller('ArticleShowCtrl', function($scope, $http, $routeParams, $location, $_) {

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
    $scope.user = data.user;
  });

//////////////    test area   /////////////////////////////////////////////////
//
//    Working on a function to delete posts.  I think i have it set up correct.
//    I just need to make the articles show correctly so that they can be 
//    deleted.
//
//    The hidePost works, after clicking the button you must refresh the page
//    for the hiding to work.  
///////////////////////////////////////////////////////////////////////////////
  
  $scope.hidePost = function(article) {
    article._deleted = true;
      $http.post('/api/article', article);
  };







/*
  $scope.removePost = function(article_rev , article_id){
    $http.get("/api/article/" + article_id).success(function() {
      $http.delete("/api/article/" + article_id);
    });
    /*$http.delete("/article/" + article_id);
  };*/

});

angular.module('App').controller('HomeCtrl', function($scope, $routeParams, $http, $markdown, $_) {
  
/*  $scope.user = $routeParams.user;
  $http.get('/api/article/' + $routeParams.user + '/all')
    .success(function(data) {
      $scope.articles = $_(data.rows).pluck('value');
    });*/

 /* $scope.mode = 'New';*/
  $http.get('/api/session').success(function(data) {
    $scope.user = data.user;
  });

  $http.get('/api/article').success(function(data) {
    $scope.articles = $_(data.rows).pluck('value');
  });

});
angular.module('App').controller('SignupCtrl', function($scope, $http, $location, $dialog) {

//////////////  Login Function ////////////////////////////////////////////////
//
//    Here is the login function
///////////////////////////////////////////////////////////////////////////////

  $scope.login = function() {
      $dialog.dialog({
        backdrop: true,
        keyboard: false,
        backdropClick: false,
        dialogFade: true})
        .open('/app/templates/login.html', 'LoginCtrl');
    };

//////////////  Register Function /////////////////////////////////////////////
//
//
//    Here is the function that registers a new user
///////////////////////////////////////////////////////////////////////////////

  $scope.register = function(user) {
    $http.post('/api/signup', user)
      .success(function(user) {
        $location.path('/dashboard');
      })
      .error(function(err) {
        // alert error
      });
  };
});