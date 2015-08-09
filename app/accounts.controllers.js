/**
* accounts.controllers Module
*
* Description
*/
angular.module('accounts.controllers', [])

.controller('AccountController', ['$scope', '$state', 'Account',
 function($scope, $state, Account){
  
  $scope.bidsmapping = {
    "00": "FREE",
    "01": "$0.99",
    "02": "$4.99",
    "03": "$9.99",
    "04": "$49.99",
    "05": "$99.99"
  };
  
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

  $scope.accountProxies = [];
  var syncAccountProxies = function(){
    Account.getAccountProxies(pk)
      .then(function(s){
        if(s.status==200){ return s.data; }
        else{ throw "error getting account proxies"; }
      }, function(e){console.log(e);})

      .then(function(proxies){
        $scope.accountProxies = proxies.results;
      }, function(e){console.log(e);});
  }; syncAccountProxies();

  $scope.accountBids = [];
  var syncAccountBids = function(){
    Account.getAccountBids(pk)
      .then(function(s){
        if(s.status==200){ return s.data; }
        else{ throw "error getting account bids"; }
      }, function(e){console.log(e);})

      .then(function(bids){
        $scope.accountBids = bids.results;
      }, function(e){console.log(e);});
  }; syncAccountBids();

}])