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
        $scope.Tweets.push(tweet.emojis);
      });

      var emojiArray = [];
      EmojiFactory.getEmojis()
        .then(function(emojis) {
          emojis.data.forEach(function(obj) {
            emojiArray.push(obj);
          });
          EmojiMetricsFactory.getEmojiMetrics()
          .then(function(values) {
            var emojiMetricsArray = [];
            var emojiMetrics = {
              name: '',
              code: '',
              count: 0,
              percentage: 0
            };
            for(var emoji in values.data.totalCount) {
              var obj = values.data.totalCount[emoji];
              var match = emojiArray.filter(function(obj) {
                return obj.code === emoji;
              });
              if(obj.count >= 0) {
                if(match) {
                  emojiMetrics.name = match[0].name;
                }
                emojiMetrics.code = emoji.toLowerCase();
                emojiMetrics.count = obj.count;
                emojiMetrics.percentage = obj.percentage;
                emojiMetricsArray.push(emojiMetrics);
                emojiMetrics = {};
              }
            }
            $scope.Emojis = emojiMetricsArray.map(function(value, index) {
              return {
                emojiMetrics: value
              };
            });

            $scope.showStats = function (event) {
              var id = event.target.id;
              var emojiName = document.getElementById("emojiName");
              var count = document.getElementById("emojiCount");
              var percent = document.getElementById("emojiPercent");
              var name = emojiArray.filter(function(obj) {
                return obj.code === id.toUpperCase();
              })

              emojiName.innerHTML = name[0].name;
              count.innerHTML = values.data.totalCount[id.toUpperCase()].count;
              percent.innerHTML = values.data.totalCount[id.toUpperCase()].percentage * 100;
            }
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