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
        templateUrl: '/app/templates/article.html'
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
      .when('/:user/settings', {
        controller: 'SettingsCtrl',
        templateUrl: '/app/templates/settings.html'
      })
      .otherwise({
        redirectTo: ('/')
      });
    
  });

 angular.module('App').constant('$alerts', []);
angular.module('App').value('$markdown', markdown);
angular.module('App').value('$moment', moment);
angular.module('App').value('$_', _);
angular.module('App').filter('mdImage', function() {
  return function(input) {
    if (input) {
      return ['![',input.name, '](/uploads/',input.path,')'].join('');
    }
  };
});
angular.module('App').directive('pwCheck', [function () {
  return {
    require: 'ngModel',
    link: function (scope, elem, attrs, ctrl) {
      var firstPassword = '#' + attrs.pwCheck;
      elem.add(firstPassword).on('keyup', function () {
        scope.$apply(function () {
          var v = elem.val()===$(firstPassword).val();
          ctrl.$setValidity('pwmatch', v);
        });
      });
    }
  };
}]);
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
angular.module('App').controller('LoginCtrl', function($scope, $http, $location, authService, dialog, $alerts) {
  
  $scope.login = function(user) {
    $http.post('/api/login', user)
      .success(function(user) {
        dialog.close();
        authService.loginConfirmed();
      })
      .error(function(err) {
        // alert error
      });
    $location.path('/dashboard');
    $alerts.push({type: 'success', msg: 'Successfully logged in.'});
  };

   $scope.cancel = function() {
    dialog.close();
  };

});
angular.module('App').controller('SettingsCtrl', function($scope, $http, $routeParams, $location) {


});
angular.module('App').controller('AlertsCtrl', function($scope, $alerts) {

$scope.alerts = [];

   $scope.addAlert = function() {
    $scope.alerts.push({msg: "Another alert!"});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

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
    article.tags = article.tags.toUpperCase();
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

});
angular.module('App').controller('ArticleCtrl', function($scope, $http, $routeParams, $location) {  


  $http.get('/api/article/' + $routeParams.user + '/' + $routeParams.slug)
    .success(function(data) {
      $scope.article = data.rows[0].value;
      $scope.article.html = $markdown.toHTML($scope.article.body);
    });

});
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
angular.module('App').controller('DashboardCtrl', function($scope, $http, $location, $_, $markdown) {
  
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
});

angular.module('App').controller('HomeCtrl', function($scope, $routeParams, $http, $markdown, $_, $location) {
  
  $http.get('/api/session').success(function(data) {
    $scope.user = data.user;
  });

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
      window.alert("Thanks for signing up, now you can login.");

      })
      .error(function(err) {
        // alert error
      });
  };


});