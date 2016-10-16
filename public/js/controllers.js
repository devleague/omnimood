angular.module('omniMood')
  .controller('tweetController', [
    '$scope',
    'socket',
    'EmojiFactory',
    'EmojiMetricsFactory',
    function ($scope, socket, EmojiFactory, EmojiMetricsFactory) {
      $scope.Tweets = [];
      $scope.moodMin = -10;
      $scope.moodMid = 0;
      $scope.moodMax = 10;
      socket.emit('start tweets', true);
      socket.on('tweet', function(tweet) {
        $scope.coordinates = tweet.coordinates;
        $scope.Tweets.push(tweet.emojis);
      });

      var emojiArray = [];
      // $scope.Emojis = [];
      EmojiFactory.getEmojis()
        .then(function(emojis) {
          emojis.data.forEach(function(code) {
            // $scope.Emojis.push(code);
            emojiArray.push(code);
          });
        });

      var emojiMetrics = [];
      // $scope.EmojiMetrics = [];
      EmojiMetricsFactory.getEmojiMetrics()
        .then(function(values) {
          for(var emoji in values.data.totalCount) {
            var obj = values.data.totalCount[emoji];
            if(obj.count) {
              console.log(obj.count);
              console.log(obj.percentage);
              // $scope.EmojiMetrics.push(obj.count);
              emojiMetric.push(obj.count);
            }
          }
        });

      var emojiObject = {
        emojiArray: emojiArray,
        emojiMetrics: emojiMetrics
      };

      $scope.Emojis.push(emojiObject);
    }
  ])
  .controller('toggleViewController', function($scope) {
    $scope.show = true;
    $scope.$watch('show', function() {
      $scope.toggleText = $scope.show ? '3D View' : '2D View';
    });
  });