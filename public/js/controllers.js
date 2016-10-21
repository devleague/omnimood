angular.module('omniMood')
  .controller('tweetController', [
    '$scope',
    'socket',
    'EmojiFactory',
    'EmojiMetricsFactory',
    function ($scope, socket, EmojiFactory, EmojiMetricsFactory) {
      $scope.Tweets = [];
      socket.on('tweet', function (tweet) {
        $scope.tweet = tweet;
      });
      var emojiArray = [];
      var emojiMetricsArray = [];
      var lightEmoji = '';
      $scope.Tweets = [];
      $scope.Emojis = [];
      EmojiFactory.getEmojis()
        .then(function(emojis) {
          emojis.data.forEach(function(code) {
            // console.log(code.code);
            emojiArray.push(code);
          });
          EmojiMetricsFactory.getEmojiMetrics()
          .then(function(values) {
            var emojiMetrics = {
              count: 0,
              percentage: 0
            };
            // console.log(Object.keys(values.data.totalCount).length);

            for(var emoji in values.data.totalCount) {
              var obj = values.data.totalCount[emoji];
              // console.log(obj.percentage);
              // console.log("\n");
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
              };
            });
          });
        });


        socket.emit('start tweets', true);
        socket.on('tweet', function (tweet) {
          $scope.tweet = tweet;
          var pngValues = ["1F602","2764","2665","1F60D","1F60A","1F618","1F495","263A","1F601","1F609","1F44D","1F60C","1F60E","270C","1F604","1F496","1F61C","1F603","1F606","1F63B","1F600","1F61A","1F607","1F639","1F619","1F44C","1F614","1F60F","1F605","1F611","1F615","1F610","1F62A","1F61D","1F613","1F623","1F61B","1F62C","1F627","1F635","1F62E","1F62F","1F62D","1F612","1F629","1F622","1F494","1F61E","1F60B","1F631","1F621","1F625","1F62B","1F624","1F637","1F620","1F616","1F630","1F628","1F61F"];
          var htmlCodes = ["0x1F602", "0x2764", "0x2665", "0x1F60D", "0x1F60A", "0x1F618", "0x1F495", "0x263A", "0x1F601", "0x1F609", "0x1F44D", "0x1F60C", "0x1F60E", "0x270C", "0x1F604", "0x1F496", "0x1F61C", "0x1F603", "0x1F606", "0x1F63B", "0x1F600", "0x1F61A", "0x1F607", "0x1F639", "0x1F619", "0x1F44C", "0x1F614", "0x1F60F", "0x1F605", "0x1F611", "0x1F615", "0x1F610", "0x1F62A", "0x1F61D", "0x1F613", "0x1F623", "0x1F61B", "0x1F62C", "0x1F627", "0x1F635", "0x1F62E", "0x1F62F", "0x1F62D", "0x1F612", "0x1F629", "0x1F622", "0x1F494", "0x1F61E", "0x1F60B", "0x1F631", "0x1F621", "0x1F625", "0x1F62B", "0x1F624", "0x1F637", "0x1F620", "0x1F616", "0x1F630", "0x1F628", "0x1F61F"];
          var emojiCodes = [];
          for(var i = 0; i < htmlCodes.length; i++) {
            emojiCodes[i] = String.fromCodePoint(htmlCodes[i]);
          }
          for(i = 0; i < tweet.emojis.length; i++) {
            if(emojiCodes.indexOf(tweet.emojis[i].toString()) !== -1) {
              // console.log("match found!");
              lightEmoji = pngValues[i];
            }
          }
          $scope.Tweets.push(tweet.emojis);
        });
    }
  ])
  .controller('toggleViewController', function ($scope) {
    $scope.show = true;
    $scope.showTwo = false;
    $scope.time = false;
    $scope.toggleText = '3D View';
    $scope.toggleTime = 'TimeMap';
    $scope.lastView = "3D View"
    $scope.toggleView = function(){
      $scope.time = false;
      if($scope.toggleText === "3D View"){
        $scope.showTwo = true;
        $scope.show = false;
        $scope.lastView = "2D View";
      }
      else{
        $scope.show = true;
        $scope.showTwo = false;
        $scope.lastView = "3D View";
      }
      $scope.toggleText = $scope.show ? '3D View' : '2D View';
      $scope.toggleTime = "TimeMap";
    }
    $scope.toggleMap = function(){
      if($scope.time){
        if($scope.lastView === "3D View"){
          $scope.showTwo = true;
          $scope.show = false;
          $scope.time = false;
        }
        else{
          $scope.showTwo = false;
          $scope.show = true;
          $scope.time = false;
        }
        $scope.toggleTime = "TimeMap";
      }
      else{
        if($scope.show){
          $scope.lastView = "2D View";
          $scope.toggleText = "3D View";
        }
        else{
          $scope.lastView = "3D View";
          $scope.toggleText = "2D View";
        }
        $scope.show = false;
        $scope.showTwo = false;
        $scope.time = true;
        $scope.toggleTime = $scope.lastView;
      }
    }
  });