/**
* authentication.controllers Module
*
* Description
*/
angular.module('authentication.controllers', [])

.controller('AuthenticationController', ['$scope', '$state', 'Authentication',
 function($scope, $state, Authentication){

  $scope.user = {};
  $scope.authenticate = function(user, mode){
    var pass = user.password;
    if(mode=='register'){
      Authentication.registerUser(user)
        .then(function(s){
          if(s.status==201){ return s.data; }
        }, function(e){console.log(e);})

        .then(function(user){
          var credentials = {"username": user.username, "password": pass};
          validateCredentials(credentials);
        }, function(e){console.log(e);})    
    }else if(mode=='signin'){
      var credentials = {"username": user.username, "password": pass};
      validateCredentials(credentials);
    }else{
      console.log("error");
    }
  };

  var validateCredentials = function(credentials){
    Authentication.authenticateCredentials(credentials)
      .then(function(s){
        console.log(s);
        return s.data;
      }, function(e){console.log(e);})

      .then(function(token){
        Authentication.cacheToken(token.token);
        $state.go('proxies');

      }, function(e){console.log(e);});
  };

}])