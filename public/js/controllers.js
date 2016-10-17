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
        $scope.tweet = tweet;
        var htmlCodes = ["0x1F602", "0x2764", "0x2665", "0x1F60D", "0x1F60A", "0x1F618", "0x1F495", "0x263A", "0x1F601", "0x1F609", "0x1F44D", "0x1F60C", "0x1F60E", "0x270C", "0x1F604", "0x1F496", "0x1F61C", "0x1F603", "0x1F606", "0x1F63B", "0x1F600", "0x1F61A", "0x1F607", "0x1F639", "0x1F619", "0x1F44C", "0x1F614", "0x1F60F", "0x1F605", "0x1F611", "0x1F615", "0x1F610", "0x1F62A", "0x1F61D", "0x1F613", "0x1F623", "0x1F61B", "0x1F62C", "0x1F627", "0x1F635", "0x1F62E", "0x1F62F", "0x1F62D", "0x1F612", "0x1F629", "0x1F622", "0x1F494", "0x1F61E", "0x1F60B", "0x1F631", "0x1F621", "0x1F625", "0x1F62B", "0x1F624", "0x1F637", "0x1F620", "0x1F616", "0x1F630", "0x1F628", "0x1F61F"];
        var emojiCodes = [];
        for(var i = 0; i < htmlCodes.length; i++) {
          emojiCodes[i] = String.fromCodePoint(htmlCodes[i]);
        }
        for(i = 0; i < tweet.emojis.length; i++) {
          console.log(tweet.emojis[i].toString());
          if(emojiCodes.indexOf(tweet.emojis[i].toString()) !== -1) {
            console.log("match found!");
          }
        }
        $scope.Tweets.push(tweet.emojis);
      });
      var emojiArray = [];
      EmojiFactory.getEmojis()
        .then(function(emojis) {
          emojis.data.forEach(function(code) {
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
                emojiMetricsArray.push(emojiMetrics);
                emojiMetrics = {};
              }
            }

            var emojiObject = {};
            $scope.Emojis = emojiMetricsArray.map(function(value, index) {
              return {
                emoji: emojiArray[index],
                emojiMetrics: value
              }
            })
          })
        });
    }
  ])
  .controller('toggleViewController', function ($scope) {
    $scope.show = true;
    $scope.$watch('show', function () {
      $scope.toggleText = $scope.show ? '3D View' : '2D View';
    });
  });