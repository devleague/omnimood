angular.module('omniMood')
  .directive('legend', function() {
    return {
      restrict: 'E',
      link: link
    };

    function link(scope, element, attr) {
      var width = 170,
        height = 170;

      var svgLegend = d3.select(element[0])
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'legend');

      var moodInfo = [{
        color: 'green',
        mood: 'Happy',
        y_position: height * .15,
        image: '/emojis/1f601.png'
      }, {
        color: 'yellow',
        mood: 'So so',
        y_position: height * .5,
        image: '/emojis/1f610.png'
      }, {
        color: 'red',
        mood: 'Mad',
        y_position: height * .81,
        image: '/emojis/1f621.png'
      }, ];

      svgLegend.selectAll('circle')
        .data(moodInfo)
        .enter().append('circle')
        .attr('r', 5)
        .attr('cx', width * .1)
        .attr('cy', function(d) {
          return d.y_position;
        })
        .style('fill', function(d) {
          return d.color;
        });

      svgLegend.selectAll('text')
        .data(moodInfo)
        .enter().append('text')
        .attr('x', width * .3)
        .attr('y', function(d) {
          return d.y_position + 5;
        })
        .text(function(d) {
          return d.mood;
        })
        .attr('fill', 'white');

      svgLegend.selectAll('image')
        .data(moodInfo)
        .enter().append('image')
        .attr('width', 30)
        .attr('height', 30)
        .attr('x', width * .7)
        .attr('y', function(d) {
          return d.y_position - 14;
        })
        .attr('xlink:href', function(d) {
          return d.image;
        });
    }
  });