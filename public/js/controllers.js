angular.module('omniMood')
  .controller('tweetController', [
    '$scope',
    'socket',
    function($scope, socket) {
      $scope.Tweets = [];
      $scope.moodMin = -10;
      $scope.moodMid = 0;
      $scope.moodMax = 10;
      socket.emit('start tweets', true);
      socket.on('tweet', function(tweet) {
        $scope.coordinates = tweet.coordinates;
        $scope.Tweets.push(tweet.emojis);
      });
    }
  ])
  .controller('emojiController', [
    '$scope',
    'EmojiFactory',
    function($scope, EmojiFactory) {
      $scope.Emojis = [];
      EmojiFactory.getEmojis()
        .then(function(emojis) {
          emojis.data.forEach(function(code) {
            $scope.Emojis.push(code);
          });
        });
    }
  ])
  .controller('toggleViewController', function($scope) {
    $scope.show = true;
    $scope.$watch('show', function() {
      $scope.toggleText = $scope.show ? '3D View' : '2D View';
    });
  });