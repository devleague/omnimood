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
  ]);