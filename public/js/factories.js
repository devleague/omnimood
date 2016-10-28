angular.module('omniMood')
  .factory('EmojiFactory', [
  '$http', function($http) {
    return {
      getEmojis: function () {
        return $http.get('../json/orderedEmojis.json');
      }
    }
  }])
  .factory('EmojiMetricsFactory', [
    '$http', function($http) {
      var endpoint = '/api/timeline';
      return {
        getEmojiMetrics: function () {
          return $http.get(endpoint);
        }
      }
    }])
  .factory('socket', function ($rootScope) {
    var socket = io.connect('/');
    var socketFunctions = {
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
    socketFunctions.emit('start tweets', true);
    return socketFunctions;
  });