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
      });

      var emojiArray = [];
      EmojiFactory.getEmojis()
        .then(function(emojis) {
          emojis.data.forEach(function(code) {
            emojiArray.push(code);
          });
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
              };
            });
          });
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