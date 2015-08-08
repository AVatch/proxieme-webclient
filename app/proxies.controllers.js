/**
* proxies.controllers Module
*
* Description
*/
angular.module('proxies.controllers', [])

.controller('ProxiesController', ['$scope', 'Proxie',
  function($scope, Proxie){

    $scope.proxie = {"proxie":"", "description": ""};

    $scope.proxies = [];
    var syncProxies = function(){
      Proxie.getProxies()
        .then(function(s){
          if(s.status==200){ return s.data; }
          else{ throw "error getting proxies"; }
        }, function(e){console.log(e);})

        .then(function(proxies){
          console.log(proxies)
          $scope.proxies = proxies.results;

        }, function(e){console.log(e);});
    }; syncProxies();
  
}])

.controller('ProxieController', ['$scope',
 function($scope){
  
}])