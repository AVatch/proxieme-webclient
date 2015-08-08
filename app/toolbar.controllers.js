/**
* toolbar.controllers Module
*
* Description
*/
angular.module('toolbar.controllers', [])

.controller('ToolbarController', ['$scope', '$rootScope', '$state', 'Account',
  function($scope, $rootScope, $state, Account){
   
    $scope.account = {};
    var syncMe = function(){
      Account.me()
        .then(function(s){
          if(s.status==200){ return s.data; }
        }, function(e){console.log(e);})
        .then(function(me){
          $scope.account = me;
          $rootScope.me = me;
        })
    }; syncMe();

}])