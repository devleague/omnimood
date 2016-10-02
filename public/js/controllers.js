angular.module('omniMood')
  .controller('tweetController', [
    '$scope',
    '$interval',
    'TweetFactory',
    function ($scope, $interval, TweetFactory) {
      $scope.Tweets = [];
      $interval(() => {
        TweetFactory.getTweets()
        .then((tweets) => {
          $scope.Tweets = tweets.data;
        });
      }, 1000);
    }
  ]);