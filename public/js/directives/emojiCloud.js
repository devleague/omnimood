angular.module('omniMood')
  .directive('cloud', function() {
      return {
        restrict: 'E',
        scope: {
          tweet: '=',
        },
        link: link
      };

      function link (scope, element, attr) {
        var width = 640;
        var height = 480;

        var canvas = d3.select('cloud')
          .append('svg')
          .attr('width', width)
          .attr('height', height);

        scope.$watch('tweet', function (tweet) {
          if(tweet) {
            console.log(tweet.emojis);
            var pack = d3.pack()
              .size([width, height]);

            // console.log(pack);
          }
        });
      }
    });