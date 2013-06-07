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