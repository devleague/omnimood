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

        var canvas = d3.select(element[0])
          .append('svg')
          .attr('width', width)
          .attr('height', height);

        scope.$watch('tweet', function (tweet) {
          if(tweet) {
            var bubble = d3.pack(tweet.emojis)
              .size([width, height])
              .padding(3);

            // var node = canvas.selectAll('.node')
            //   .data(bubble.nodes(tweet)
            //   .filter(function(d) { return !d.children; }))
            //   .enter()
            //     .append('g')
            //     .attr('class', 'node');
          }
        });
      }
    });