/**
* accounts.controllers Module
*
* Description
*/
angular.module('accounts.controllers', [])

.controller('AccountController', ['$scope', '$state', 'Account',
 function($scope, $state, Account){
  
  var pk = $state.params.pk;

  $scope.account = {};
  var syncAccount = function(){
    Account.getAccount(pk)
      .then(function(s){
        if(s.status==200){ return s.data; }
        else{ throw "error getting account"; }
      }, function(e){console.log(e);})

      .then(function(account){
        $scope.account = account;
      }, function(e){console.log(e);});

  }; syncAccount();

}])