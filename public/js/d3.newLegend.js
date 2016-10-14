var widthLegend = 170,
    heightLegend = 170;

var svgLegend = d3.select('body')
  .append('svg')
  .attr('width', widthLegend)
  .attr('height', heightLegend)
  .attr('id', 'legend')
  .style('fill', 'white');

svgLegend.append('rect')
  .attr('width', widthLegend)
  .attr('height', heightLegend)
  .attr('stroke', 'black')
  .attr('stroke-width', 1)
  .attr('fill', 'none');

var moodInfo = [
  {
    color: 'green',
    mood:'Happy',
    y_position: heightLegend * .15,
    image: '/emojis/1f601.png'
  },
  {
    color: 'yellow',
    mood: 'So so',
    y_position: heightLegend * .5,
    image: '/emojis/1f610.png'
  },
  {
    color: 'red',
    mood: 'Mad',
    y_position: heightLegend * .81,
    image: '/emojis/1f621.png'
  },

];

var colors = svgLegend.selectAll('circle')
  .data(moodInfo)
    .enter().append('circle')
    .attr('r', 5)
    .attr('cx', widthLegend * .1)
    .attr('cy', function (d) {
      return d.y_position;
    })
    .style('fill', function (d) {
      return d.color;
    });

var moods = svgLegend.selectAll('text')
  .data(moodInfo)
    .enter().append('text')
    .attr('x', widthLegend * .3)
    .attr('y', function (d) {
      return d.y_position + 5;
    })
    .text(function (d) {
      return d.mood;
    });

var images = svgLegend.selectAll('image')
  .data(moodInfo)
    .enter().append('image')
    .attr('width', 30)
    .attr('height', 30)
    .attr('x', widthLegend * .7)
    .attr('y', function (d) {
      return d.y_position - 14;
    })
    .attr('xlink:href', function (d) {
      return d.image;
    });