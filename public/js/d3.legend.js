var length = d3.select('svg#svg_map')
  .attr('width');

var svgLegend = d3.select('svg#legend')
  .attr('width', length * .3)
  .attr('height', 55)
  // .attr('border', 1)
  .style('fill', 'white');

svgLegend.append('rect')
  .attr('width', svgLegend.attr('width'))
  .attr('height', svgLegend.attr('height'))
  .attr('x', 0)
  .attr('y', 0)
  .style('stroke', 'black')
  .style('fill', 'none')
  .style('stroke-width', 1);

var defs = svgLegend.append('defs');

var linearGradient = defs.append('linearGradient')
  .attr('id', 'linear-gradient');

linearGradient.append('stop')
  .attr('offset', '0%')
  .attr('stop-color', 'red');

linearGradient.append('stop')
  .attr('offset', '50%')
  .attr('stop-color', 'yellow');

linearGradient.append('stop')
  .attr('offset', '100%')
  .attr('stop-color', 'green');

var moodBar = svgLegend.append('rect')
  .attr('width', svgLegend.attr('width') * .8)
  .attr('height', svgLegend.attr('height') * .5)
  .attr('x', svgLegend.attr('width') * .10)
  .attr('y', svgLegend.attr('height') * .10)
  .style('fill', 'url(#linear-gradient');

var moodLegend = [
  {
    color: 'red',
    mood: 'Mad',
    x_position: svgLegend.attr('width') * .1
  },
  {
    color: 'yellow',
    mood: 'Neutral',
    x_position: svgLegend.attr('width') * .44
  },
  {
    color: 'green',
    mood:'Happy',
    x_position: svgLegend.attr('width') * .81
  }
];

svgLegend.selectAll('text')
  .data(moodLegend)
  .enter()
  .append('text')
    .attr('x', function (d) {
      return d.x_position;
    })
    .attr('y', svgLegend.attr('height') * .84)
    .text(function (d) {
      return d.mood;
    });