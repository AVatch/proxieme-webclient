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

    return{
      getProxies: getProxies,
      getProxie: getProxie,
      getProxieBids: getProxieBids,
      postProxie: postProxie
    };
}])