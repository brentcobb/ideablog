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
      })
    ;
  });