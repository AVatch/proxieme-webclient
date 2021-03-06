/**
* proxies.services Module
*
* Description
*/
angular.module('proxies.services', [])

.factory('Proxie', ['$http', 'Authentication', 'VERSION', 'DOMAIN',
  function($http, Authentication, VERSION, DOMAIN){
  
    var getProxies = function(){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/' + VERSION + '/proxies/',
                        method: 'GET',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                        data: ''
                      });
      return response;
    };

    var getProxie = function(pk){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/' + VERSION + '/proxies/' + pk + '/',
                        method: 'GET',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                        data: ''
                      });
      return response;
    };


    var getProxieBids = function(pk){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/' + VERSION + '/proxies/' + pk + '/bids/',
                        method: 'GET',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                        data: ''
                      });
      return response;
    };


    var getProxieSessions = function(pk){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/' + VERSION + '/proxies/' + pk + '/sessions/',
                        method: 'GET',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                        data: ''
                      });
      return response;
    };


    var postProxie = function(proxie){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/' + VERSION + '/proxies/',
                        method: 'POST',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                        data: proxie
                      });
      return response;
    };

    var postProxieBid = function(bid){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/' + VERSION + '/bids/',
                        method: 'POST',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                        data: bid
                      });
      return response;
    };

    var acceptBid = function(session){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/' + VERSION + '/proxiessessions/',
                        method: 'POST',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                        data: session
                      });
      return response;
    };    

    return{
      getProxies: getProxies,
      getProxie: getProxie,
      getProxieBids: getProxieBids,
      getProxieSessions: getProxieSessions,
      postProxie: postProxie,
      postProxieBid: postProxieBid,
      acceptBid: acceptBid
    };
}])