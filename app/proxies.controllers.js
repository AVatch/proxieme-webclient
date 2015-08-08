/**
* proxies.controllers Module
*
* Description
*/
angular.module('proxies.controllers', [])

.controller('ProxiesController', ['$scope', '$rootScope',
  '$timeout', 'Account', 'Proxie',
  function($scope, $rootScope, $timeout, Account, Proxie){

    $scope.proxies = [];
    $scope.proxiesLoaded = false;
    var syncProxies = function(){
      Proxie.getProxies()
        .then(function(s){
          if(s.status==200){ return s.data; }
          else{ throw "error getting proxies"; }
        }, function(e){console.log(e);})

        .then(function(proxies){
          $scope.proxies = proxies.results;
          $timeout(function(){$scope.proxiesLoaded=true;}, 1000)
        }, function(e){console.log(e);});
    }; syncProxies();

    $scope.proxie = {"proxie":"", "description": ""};
    $scope.createProxie = function(proxie){
      proxie.account = $rootScope.me.id;
      Proxie.postProxie(proxie)
        .then(function(s){
          if(s.status==201){ return s.data; }
          else{ throw "error creating proxie"; }
        }, function(e){console.log(e);})

        .then(function(newProxie){
          $scope.proxies.unshift(newProxie);
          $scope.proxie = {"proxie":"", "description": ""};
        }, function(e){console.log(e);});
    };
  
}])

.controller('ProxieController', ['$scope', '$rootScope', '$state', 
 '$timeout', 'Account', 'Proxie',
 function($scope, $rootScope, $state, $timeout, Account, Proxie){

  var pk = $state.params.pk;

  $scope.proxie = {};
  var syncProxie = function(){
    Proxie.getProxie(pk)
      .then(function(s){
        if(s.status==200){ return s.data; }
        else{ throw "error fetching proxy"; }
      }, function(e){console.log(e);})

      .then(function(proxie){
        $scope.proxie = proxie;
        if($scope.proxie.account == $rootScope.me.id){
          $scope.proxie.owner = true;
        }
      }, function(e){console.log(e);});
  }; syncProxie();

  $scope.bids = [];
  $scope.bidsLoaded = false;
  $scope.bidsmapping = {
    "00": "FREE",
    "01": "$0.99",
    "02": "$4.99",
    "03": "$9.99",
    "04": "$49.99",
    "05": "$99.99"
  };

  var syncBids = function(){
    Proxie.getProxieBids(pk)
      .then(function(s){
        if(s.status==200){ return s.data; }
        else{ throw "error fetching proxy"; }
      }, function(e){console.log(e);})

      .then(function(bids){
        $scope.bids = bids.results;
        $timeout(function(){$scope.bidsLoaded=true;}, 1000)
      }, function(e){console.log(e);});  
  }; syncBids();

  $scope.offeredBid = null;
  $scope.selectBidChoice = function(val){
    $scope.offeredBid = val;
  }
  $scope.createBid = function(){
    var bid = {
      "bid": $scope.offeredBid,
      "bidder": $scope.me.id,
      "proxie": $scope.proxie.id
    };
    if($scope.offeredBid!=null){
      Proxie.postProxieBid(bid)
        .then(function(s){
          if(s.status==201){ return s.data; }
          else{ throw "error making bid"; }
        }, function(e){console.log(e);})

        .then(function(newBid){
          newBid.bidder = $rootScope.me;
          $scope.bids.unshift(newBid);          
        }, function(e){console.log(e);});
    }
  };

}])