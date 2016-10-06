angular.module('omniMood')
  .controller('tweetController', [
    '$scope',
    'socket',
    function ($scope, socket) {
      $scope.Tweets = [];
      socket.emit('start tweets', true);
      socket.on('tweet', function (tweet) {
        $scope.Tweets.push(tweet);
      });
    }
  ]);