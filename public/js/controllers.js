angular.module('omniMood')
  .controller('tweetController', [
    '$scope',
    'TweetFactory',
    function ($scope, TweetFactory) {
      $scope.Tweets = [];
      TweetFactory.getTweets()
      .then((tweets) => {
        $scope.Tweets = tweets.data;
      });
    }
  ]);