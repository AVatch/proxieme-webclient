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

  $scope.acceptingBids = true;
  $scope.acceptBid = function(bidID, proxieID, surrogateID, requesterID){
    if($scope.acceptingBids){
      var session =   {
          "sessionID": "1",
          "surrogateID": "1",
          "requesterID": "1",
          "bid": bidID,
          "proxie": proxieID,
          "surrogate": surrogateID,
          "requester": requesterID
      }

      Proxie.acceptBid(session)
        .then(function(s){
          if(s.status==201){ return s.data; }
          else{ throw "error accepting bid"; }
        }, function(e){console.log(e);})

        .then(function(newBid){
          $scope.acceptingBids = false;
          syncSessions();
        }, function(e){console.log(e);});
    }
  };


  $scope.session = {};
  var session;
  var sessionId;
  var token;
  var apiKey = '45306032';
  var syncSessions = function(){
    Proxie.getProxieSessions(pk)
      .then(function(s){
        if(s.status==200){ return s.data; }
        else{ throw "error syncing sessions"; }
      }, function(e){console.log(e);})

      .then(function(sessions){
        $scope.session = sessions.results[0];
        if(sessions.count>0){ 
          $scope.acceptingBids = false;
          sessionId = $scope.session.sessionID;
          token = $scope.session.requesterID;
          initSession();
        }
      }, function(e){console.log(e);});
  }; syncSessions();

  var initSession = function(){
    session = OT.initSession(apiKey, sessionId);
    // Add event listeners to the session
    session.on({
      sessionDisconnected: function(event) {
        // The user was disconnected from the Session. Any subscribers
        // and publishers will automatically be removed from the dom.
      },
      streamCreated: function(event) {
        // Subscribe to a new third-party stream in the session.
        console.log('streamCreated');
        var subOptions = {insertMode: 'append'};
        session.subscribe(event.stream, 'subscribersContainer', subOptions);
      },
      signal: function(event) {
        // A signal was received.
        var signalsDiv = document.getElementById('signals');
        var messageP = document.createElement('p');
        messageP.innerHTML = event.data;
        signalsDiv.appendChild(messageP);
      }
    });
  };


  $scope.streaming = false;
  $scope.startSession = function(){
    $scope.connect();
    $scope.streaming = true;
  };
  $scope.stopSession = function(){
    $scope.stopPublishing();
    $scope.disconnect();
    $scope.streaming = false;
  };

  $scope.connect = function() {
    session.connect(token, function(error) {
      if (error) {
        alert(error.message);
      } else {
        $scope.startPublishing();
      }
    });
  };
  $scope.disconnect = function() {
    session.disconnect();
  };

  // Called when user wants to start publishing to the session
  $scope.startPublishing = function() {
    var publisherOptions = {
      name: 'A web-based OpenTok client',
      insertMode: 'append'
    };
    publisher = OT.initPublisher('publisherContainer', publisherOptions);
    session.publish(publisher, function(error) {
      if (error) {
        alert(error.message);
      }
    });
  };
  $scope.stopPublishing = function(){
    session.unpublish(publisher);
  };
  //--------------------------------------
  //  HELPER METHODS
  //--------------------------------------
  var show = function(id) {
    document.getElementById(id).style.display = 'block';
  };
  var hide = function(id) {
    document.getElementById(id).style.display = 'none';
  };


}])