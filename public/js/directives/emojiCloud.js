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
        var width = parseInt(d3.select('.sideBar').style('width'));
        var height = parseInt(d3.select('.sideBar').style('height'))/4;
        var emojiList = [],
            emojiCodeList,
            highestCount = 0;

        var cloudScale = d3.scaleLinear()
            .domain([52, 250])
            .range([0.2, 0.9]);

        var svg = d3.select(element[0])
          .append('svg')
          .attr('class', 'emojiCloud')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('class', 'node')
          .attr('transform', "translate(" + width/2 + "," + height/2 + ")scale(" + cloudScale(width) + ")");

        var defs = d3.select('.emojiCloud').append('svg:defs');

        d3.json('/json/codeEmoji.json', function (emojiObject) {
          emojiCodeList = emojiObject;
        });

        d3.select(window).on('resize.cloud', resizeCloud);

        scope.$watch('tweet', function (tweet) {
          if(tweet) {
            var surrogate = tweet.emojis.map((emoji) => {
              return '\\u' + emoji.charCodeAt(0).toString(16).toUpperCase() + '\\u' + emoji.charCodeAt(1).toString(16).toUpperCase();
            });

            var emojiSize = d3.scaleLinear()
              .domain([1, 50])
              .range([7, 45]);

            var simulation = d3.forceSimulation()
              .force('center', d3.forceCenter())
              .force('charge', d3.forceManyBody().strength(0.5).distanceMin(5))
              .force("collide", d3.forceCollide(function (d) {
                return emojiSize(d.counter);
              }).iterations(4));

            emojiList.sort(function (a, b) {
              return b.counter - a.counter; // decreasing order
            });

            surrogate.forEach(function(surrogate) {
              if (emojiCodeList[surrogate]) {
                checkForEmoji(surrogate, emojiCodeList[surrogate].code, simulation);
              }
            });

            if(emojiList[0]) {
              highest = emojiList[0].counter;
            }

            if(highest > 50) {
              emojiSize = d3.scaleLinear()
              .domain([1, highest])
              .range([7, 45]);
            }

            simulation
              .nodes(emojiList)
              .on('tick', tick);

            var node = svg.selectAll('.emojis')
              .data(emojiList);

            node.exit().remove();

            node
              .enter()
                .append('g')
                .append('circle')
                .attr('class', 'emojis')
                .style('fill', function (d) {
                  return 'url('+ '#' + d.code.toUpperCase() + ')';
                })
                .merge(node)
                .attr('cx', function (d) {
                  return d.x;
                })
                .attr('cy', function (d) {
                  return d.y;
                })
                .attr('r', function (d) { return emojiSize(d.counter); })
                .attr('id', function (d, i) {
                  return d.code;
                });

            var defsPattern = defs.selectAll('.imgPattern')
              .data(emojiList);

            defsPattern.exit().remove();

            defsPattern
              .enter().append('pattern')
                .attr('class', 'imgPattern')
                .attr('height', '1')
                .attr('width', '1')
                .attr("patternUnits", "objectBoundingBox")
                .attr('id', function (d) {
                  return d.code;
                })
                .append('image')
                .attr('class', 'pic')
                .attr('xlink:href', function (d, i) {
                  return '../../emojis/' + d.code.toLowerCase() + '.png';
                })
                .merge(defsPattern)
                .select('.pic')
                .attr('height', function (d) {
                  return emojiSize(d.counter);
                })
                .attr('width', function (d) {
                  return emojiSize(d.counter);
                })
                .attr('x', function (d) {
                  return ((Math.sqrt(2*(emojiSize(d.counter) * emojiSize(d.counter))))-emojiSize(d.counter))/2;
                })
                .attr('y', function (d) {
                  return ((Math.sqrt(2*(emojiSize(d.counter) * emojiSize(d.counter))))-emojiSize(d.counter))/2;
                });

            var tick = function() {
              node
                .attr('cx', function (d) {
                  return d.x;
                })
                .attr('cy', function (d) {
                  return d.y;
                });
            };
          }
        });

        function checkForEmoji (surrogate, emojiCode, simulation) {
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

        function resizeCloud () {
          var widthCloud = parseInt(d3.select('.cloudContainer').style('width'));
          var heightCloud = parseInt(d3.select('.cloudContainer').style('height')) * .8;

          d3.select('.emojiCloud')
            .attr('width', widthCloud)
            .attr('height', heightCloud);

          d3.select('.node')
            .attr('transform', "translate(" + widthCloud/2 + "," + heightCloud/2 + ")scale(" + cloudScale(widthCloud) + ")");
        }
      }
    });