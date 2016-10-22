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
        var emojiList = [];
        var emojiCodeList;

        var svg = d3.select(element[0])
          .append('svg')
          .attr('class', 'emojiCloud')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('class', 'node')
          .attr('transform', "translate(" + width/2 + "," + height/2 + ")");

        var emojiSize = d3.scaleLinear()
          .domain([5, 100])
          .range([10, 80]);


        d3.json('/json/codeEmoji.json', function (emojiObject) {
          emojiCodeList = emojiObject;
        });

        scope.$watch('tweet', function (tweet) {
          if(tweet) {
            var surrogate = tweet.emojis.map((emoji) => {
              return '\\u' + emoji.charCodeAt(0).toString(16).toUpperCase() + '\\u' + emoji.charCodeAt(1).toString(16).toUpperCase();
            });

            surrogate.forEach(function(surrogate) {
              if (emojiCodeList[surrogate]) {
                checkForEmoji(surrogate, emojiCodeList[surrogate].code);
              }
            });

            var simulation = d3.forceSimulation()
              .force("collide", d3.forceCollide( function(d){ return d.r + 1; }).iterations(4));

            var node = svg.selectAll('.emojis')
              .data(emojiList);

            node.exit().remove();

            node
              .enter()
                .append('image')
                .attr('class', 'emojis')
                .attr('xlink:href', function (d, i) {
                  return '../../emojis/' + d.code.toLowerCase() + '.png';
                })
                .attr('x', function (d) {
                  return d.x;
                })
                .attr('y', function (d) {
                  return d.y;
                })
                .merge(node)
                .attr('width', function (d, i) {
                  return d.counter;
                })
                .attr('height', function (d, i) {
                  return d.counter;
                })
                .attr('id', function (d, i) {
                  return d.code;
                });

            var tick = function () {
              node
                .attr('x', function (d) {
                  return d.x;
                })
                .attr('y', function (d) {
                  return d.y;
                });
            };

            simulation
              .nodes(emojiList)
              .on('tick', tick);
          }
        });

        function checkForEmoji (surrogate, emojiCode) {
          var isEmojiFound = emojiList.filter(function (emojiObj) {
            return emojiObj.code === emojiCode;
          });

          if(isEmojiFound.length === 0) {
            emojiList.push({
              code: emojiCode,
              counter: 1
            });
          } else {
            var indexOfFoundEmoji = emojiList.indexOf(isEmojiFound[0]);
            emojiList[indexOfFoundEmoji].counter++;
          }
        }
      }
    });