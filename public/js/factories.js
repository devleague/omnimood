angular.module('omniMood')
  .factory('TweetFactory', [
  '$http', function ($http) {
    var endpoint = '/api/tweets';
    return {
      getTweets: function () {
        return $http.get(endpoint);
      }
    };
  }
  ])
  .factory('EmojiFactory', [
  '$http', function($http) {
    return {
      getEmojis: function () {
        return $http.get('../json/emojisSpecialOrder.json');
      }
    }
  }])
  .factory('socket', function ($rootScope) {
    var socket = io.connect('http://localhost:3000');
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if(callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  });