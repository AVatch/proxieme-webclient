/**
* proxies.controllers Module
*
* Description
*/
angular.module('proxies.controllers', [])

.controller('ProxiesController', ['$scope', '$rootScope', '$timeout', 'Proxie',
  function($scope, $rootScope, $timeout, Proxie){

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
        }, function(e){console.log(e);});
    };
  
}])

.controller('ProxieController', ['$scope', '$state', 'Proxie',
 function($scope, $state, Proxie){

  var pk = $state.params.pk;
  
  $scope.proxie = {};
  var syncProxie = function(){
    Proxie.getProxie(pk)
      .then(function(s){
        if(s.status==200){ return s.data; }
        else{ throw "error fetching proxy"; }
      }, function(e){console.log(e);})

      .then(function(proxie){
        console.log(proxie);
      }, function(e){console.log(e);});
  }; syncProxie();

  $scope.bids = [];
  var syncBids = function(){
    Proxie.getProxieBids(pk)
      .then(function(s){
        if(s.status==200){ return s.data; }
        else{ throw "error fetching proxy"; }
      }, function(e){console.log(e);})

      .then(function(bids){
        console.log(bids);
      }, function(e){console.log(e);});  
  }; syncBids();

}])