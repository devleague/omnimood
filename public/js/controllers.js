angular.module('omniMood')
  .controller('tweetController', [
    '$scope',
    'socket',
    function ($scope, socket) {
      socket.emit('start tweets', true);
      socket.on('tweet', function (tweet) {
        $scope.tweet = tweet;
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
          emojis.data.forEach(function (code) {
            $scope.Emojis.push(code);
          });
        });
    }
  ])
  .controller('toggleViewController', function ($scope) {
    $scope.show = true;
    $scope.$watch('show', function () {
      $scope.toggleText = $scope.show ? '3D View' : '2D View';
    });
  });