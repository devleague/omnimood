angular.module('omniMood')
  .controller('tweetController', [
    '$scope',
    'socket',
    'EmojiFactory',
    'EmojiMetricsFactory',
    function ($scope, socket, EmojiFactory, EmojiMetricsFactory) {
      $scope.Tweets = [];
      socket.emit('start tweets', true);
      socket.on('tweet', function (tweet) {
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
          })
          EmojiMetricsFactory.getEmojiMetrics()
          .then(function(values) {
            var emojiMetricsArray = [];
            var emojiMetrics = {
              count: 0,
              percentage: 0
            };
            for(var emoji in values.data.totalCount) {
              var obj = values.data.totalCount[emoji];
              if(obj.count) {
                emojiMetrics.count = obj.count;
                emojiMetrics.percentage = obj.percentage;
                // console.log(emojiMetrics);
                emojiMetricsArray.push(emojiMetrics);
                emojiMetrics = {};
              }
            }
            console.log(emojiMetricsArray);

            var emojiObject = {};
            $scope.Emojis = emojiMetricsArray.map(function(value, index) {
              // console.log(value);
              return {
                emoji: emojiArray[index],
                emojiMetrics: value
              }
            })

            // console.log(emojiObject);
            // $scope.Emojis = emojiObject;
            // console.log($scope.Emojis);
          })
        });



      // console.log($scope.Emojis);
    }
  ])
  .controller('toggleViewController', function ($scope) {
    $scope.show = true;
    $scope.$watch('show', function () {
      $scope.toggleText = $scope.show ? '3D View' : '2D View';
    });
  });