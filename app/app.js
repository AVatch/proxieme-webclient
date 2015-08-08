/**
*  Module
*
* Description
*/
angular.module('proxie', ['ngMaterial', 
                          'ui.router', 
                          'ngCookies',

                          'accounts.controllers',
                          'accounts.services',
                          'authentication.controllers',
                          'authentication.services',
                          'proxies.controllers',
                          'proxies.services',
                          'toolbar.controllers'])

.constant('VERSION', 'v1')
// .constant('DOMAIN', 'http://idea-hopper-api-dev.elasticbeanstalk.com')
.constant('DOMAIN', 'http://localhost:8000')

.constant('COLORS', ['#F44336', '#E91E63', '#9C27B0', '#673AB7', 
                     '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', 
                     '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
                     '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
                     '#795548', '#9E9E9E', '#607D8B'])

.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
  .primaryPalette('deep-purple');
})

.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider){

    //
    // For any unmatched url
    $urlRouterProvider.otherwise('/proxies')
    //
    // Set the states
    $stateProvider
      .state('authentication', {
        url: '/authentication',  
        templateUrl: 'partials/authentication.tmpl.html',
        controller: 'AuthenticationController'
      })

      .state('proxies', {
        url: '/proxies',  
        templateUrl: 'partials/proxies.tmpl.html',
        controller: 'ProxiesController'
      })

      .state('proxie', {
        url: '/proxie/:pk',
        templateUrl: 'partials/proxie.tmpl.html',
        controller: 'ProxieController' 
      })

      .state('account', {
        url: '/account/:pk',
        templateUrl: 'partials/account.tmpl.html',
        controller: 'AccountController' 
      });
}])

.run(['$rootScope', '$state', '$urlRouter', 'Authentication', 
    function($rootScope, $state, $urlRouter, Authentication) {
      // check if the user is authenticated
      $rootScope.$on('$locationChangeSuccess', function(evt) {
        // Halt state change from even starting
        evt.preventDefault();
        // Verify the user has a session token
        var sessionToken = Authentication.getToken();
        // Continue with the update and state transition if logic allows
        if(sessionToken){
          $rootScope.authentication = {'status': true};
          $urlRouter.sync();
        }else{
          $rootScope.authentication = {'status': false};
          $state.go('authentication');
        }
    });
}])