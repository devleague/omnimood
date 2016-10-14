var widthNewLegend = 170,
    heightNewLegend = 170;

var svgNew = d3.select('body')
  .append('svg')
  .attr('width', widthNewLegend)
  .attr('height', heightNewLegend)
  .attr('id', 'legend')
  .style('fill', 'white');

svgNew.append('rect')
  .attr('width', widthNewLegend)
  .attr('height', heightNewLegend)
  .attr('stroke', 'black')
  .attr('stroke-width', 1)
  .attr('fill', 'none');

var moodInfo = [
  {
    color: 'green',
    mood:'Happy',
    y_position: heightNewLegend * .15,
    image: '/emojis/1f601.png'
  },
  {
    color: 'yellow',
    mood: 'So so',
    y_position: heightNewLegend * .5,
    image: '/emojis/1f610.png'
  },
  {
    color: 'red',
    mood: 'Mad',
    y_position: heightNewLegend * .81,
    image: '/emojis/1f621.png'
  },

];

var colors = svgNew.selectAll('circle')
  .data(moodInfo)
    .enter().append('circle')
    .attr('r', 5)
    .attr('cx', widthNewLegend * .1)
    .attr('cy', function (d) {
      return d.y_position;
    })
    .style('fill', function (d) {
      return d.color;
    });

var moods = svgNew.selectAll('text')
  .data(moodInfo)
    .enter().append('text')
    .attr('x', widthNewLegend * .3)
    .attr('y', function (d) {
      return d.y_position + 5;
    })
    .text(function (d) {
      return d.mood;
    });

var images = svgNew.selectAll('image')
  .data(moodInfo)
    .enter().append('image')
    .attr('width', 30)
    .attr('height', 30)
    .attr('x', widthNewLegend * .7)
    .attr('y', function (d) {
      return d.y_position - 14;
    })
    .attr('xlink:href', function (d) {
      return d.image;
    });